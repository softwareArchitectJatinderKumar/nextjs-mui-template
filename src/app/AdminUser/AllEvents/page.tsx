 

'use client';

import React from 'react';
import { useEventsCrud } from './useEventsCrud';
import EventCarousel from './EventCarousel';
import EventsCrudView from './EventsCrudView';

export default function EventsCrudPage() {
 
  const eventsState = useEventsCrud();

  return (
    <>
      
      <EventCarousel events={eventsState.events} />

     
      <EventsCrudView {...eventsState} />
    </>
  );
}



