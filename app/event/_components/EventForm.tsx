'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { IoAdd, IoTrash } from 'react-icons/io5';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { FormInput, FormSelect, FormAutocomplete } from '@/app/_components';
import { SPORTS } from '@/app/_constants/events';
import { createEvent, updateEvent } from '@/app/_actions';
import { useDashboardStore } from '@/app/dashboard/_store/dashboard.store';
import type { Event, Venue } from '@/app/_types';
import { formSchema, sports, type FormValues } from './schema/event.schema';

interface EventFormProps {
  venues: Venue[];
  event?: Event;
}

function EventForm({ venues, event }: EventFormProps) {
  const router = useRouter();
  const setSelectedPlan = useDashboardStore(state => state.setSelectedPlan);

  const isEditMode = Boolean(event);
  const eventFullName = event?.fullName || '';
  const eventShortName = event?.shortName || '';
  const eventDescription = event?.description || '';
  const eventSport = SPORTS.find(s => s.id === event?.sportTypeId);
  const eventSportName = eventSport?.name;
  const eventDate = event?.date ? new Date(event.date).toISOString().slice(0, 16) : '';
  const eventVenues = event?.venues
    ? Array.isArray(event.venues)
      ? event.venues
      : [event.venues]
    : [''];

  const formDefaultValues = isEditMode
    ? {
        fullName: eventFullName,
        shortName: eventShortName,
        description: eventDescription,
        sportType: eventSportName,
        date: eventDate,
        venues: eventVenues,
      }
    : {
        fullName: '',
        shortName: '',
        description: '',
        sportType: undefined,
        date: '',
        venues: [''],
      };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: formDefaultValues,
  });
  const venuesArray = form.watch('venues');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasMoreThanOneVenue = (venuesArray?.length ?? 0) > 1;

  const isUpdating = isSubmitting && isEditMode;
  const isCreating = isSubmitting && !isEditMode;
  const submitButtonText = isUpdating
    ? 'Updating...'
    : isCreating
      ? 'Creating...'
      : isEditMode
        ? 'Update Event'
        : 'Create Event';

  const addVenue = () => {
    form.setValue('venues', [...venuesArray, '']);
  };

  const removeVenue = (index: number) => {
    form.setValue(
      'venues',
      venuesArray.filter((_, i) => i !== index),
    );
  };

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);

    let result;
    if (isEditMode && event) {
      const sport = SPORTS.find(s => s.name === values.sportType);
      if (!sport) {
        toast.error('Invalid sport type');
        setIsSubmitting(false);
        return;
      }

      result = await updateEvent({
        id: event.id,
        fullName: values.fullName,
        shortName: values.shortName,
        description: values.description || '',
        sportTypeId: sport.id,
        date: values.date,
        venues: values.venues,
      });
    } else {
      result = await createEvent({
        fullName: values.fullName,
        shortName: values.shortName,
        description: values.description || '',
        sportType: values.sportType,
        date: values.date,
        venueNames: values.venues,
      });
    }

    setIsSubmitting(false);

    const successMessage = isEditMode
      ? 'Event updated successfully!'
      : 'Event created successfully!';
    const errorAction = isEditMode ? 'update' : 'create';
    const errorMessage = result.error || `Failed to ${errorAction} event`;

    if (result.success) {
      toast.success(successMessage);
      router.push('/dashboard');
    } else {
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    if (event) {
      setSelectedPlan(event);
    }
  }, [event, setSelectedPlan]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
        <FormInput
          name='fullName'
          label='Full Name'
          placeholder='Enter full name (e.g. Los Angeles Lakers vs. Boston Celtics)'
        />
        <FormInput
          name='shortName'
          label='Short Name'
          placeholder='Enter short name (e.g. LAL v BOS)'
        />
        <FormInput
          name='description'
          label='Description'
          placeholder='Enter event description (optional)'
        />
        <FormSelect
          name='sportType'
          label='Sport Type'
          options={sports.map(sport => ({ label: sport, value: sport }))}
          placeholder='Select sport type'
        />
        <FormInput name='date' label='Date & Time' type='datetime-local' />
        <div>
          <label className='text-sm font-medium mb-2 block'>Venues</label>
          {venuesArray?.map((_, index) => (
            <div key={index} className='flex gap-2 mt-2 items-start'>
              <FormAutocomplete<FormValues>
                name={`venues.${index}`}
                options={venues?.map(venue => ({ label: venue.name, value: venue.name })) || []}
                placeholder='Select or type venue'
                className='flex-1'
              />
              {hasMoreThanOneVenue && (
                <Button
                  type='button'
                  variant='destructive'
                  size='icon'
                  onClick={() => removeVenue(index)}
                  className='bg-red-500 hover:bg-red-600'
                  aria-label='Remove venue'
                  title='Remove venue'
                >
                  <IoTrash className='w-5 h-5' />
                </Button>
              )}
            </div>
          ))}
          <Button
            type='button'
            onClick={addVenue}
            className='mt-3 bg-blue-400 hover:bg-blue-500 text-white'
            aria-label='Add another venue'
          >
            <IoAdd className='w-5 h-5' />
            Add another venue
          </Button>
        </div>
        <Button
          type='submit'
          disabled={isSubmitting}
          className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm hover:shadow-lg transition-all duration-200'
        >
          {submitButtonText}
        </Button>
      </form>
    </Form>
  );
}

export default EventForm;
