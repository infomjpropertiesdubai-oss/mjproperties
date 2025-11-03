import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { validateConsultationRequestForm, type CreateConsultationRequestData } from '@/lib/consultation-requests'

// GET /api/consultation-requests - Fetch all consultation requests
export async function GET(request: NextRequest) {
  try {
    const { data: requests, error } = await supabase
      .from('consultation_requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching consultation requests:', error)
      return NextResponse.json(
        { error: 'Failed to fetch consultation requests', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: requests,
      total: requests?.length || 0
    })

  } catch (error) {
    console.error('Error in consultation requests GET API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/consultation-requests - Create a new consultation request
export async function POST(request: NextRequest) {
  try {
    const body: CreateConsultationRequestData & { subscribe_to_newsletter?: boolean } = await request.json()

    // Extract newsletter subscription flag
    const subscribeToNewsletter = body.subscribe_to_newsletter || false
    const consultationData = { ...body }
    delete consultationData.subscribe_to_newsletter

    // Validate the form data
    const validationErrors = validateConsultationRequestForm(consultationData)
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      )
    }

    // Prepare consultation request data for insert
    const consultationInsert = {
      ...consultationData,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Insert consultation request
    const { data: consultationRequest, error: consultationError } = await supabase
      .from('consultation_requests')
      .insert(consultationInsert)
      .select()
      .single()

    if (consultationError) {
      console.error('Consultation request creation error:', consultationError)
      return NextResponse.json(
        { error: 'Failed to submit consultation request', details: consultationError.message },
        { status: 500 }
      )
    }

    // If user opted for newsletter subscription, add them to newsletter_subscriptions table
    if (subscribeToNewsletter && consultationData.email) {
      const normalizedEmail = consultationData.email.toLowerCase().trim()

      // Check if email already exists in newsletter_subscriptions
      const { data: existingSubscription } = await supabase
        .from('newsletter_subscriptions')
        .select('id, is_active')
        .eq('email', normalizedEmail)
        .maybeSingle()

      // Only insert if doesn't exist or reactivate if inactive
      if (!existingSubscription) {
        await supabase
          .from('newsletter_subscriptions')
          .insert({
            email: normalizedEmail,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
      } else if (!existingSubscription.is_active) {
        await supabase
          .from('newsletter_subscriptions')
          .update({
            is_active: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingSubscription.id)
      }
    }

    return NextResponse.json({
      success: true,
      data: consultationRequest,
      message: 'Consultation request submitted successfully'
    })

  } catch (error) {
    console.error('Error in consultation request API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}