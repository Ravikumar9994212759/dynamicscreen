import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

const useRealTimeUpdates = () => {
  useEffect(() => {
    if (!supabase) {
      console.error('Supabase client is not initialized');
      return;
    }

    const subscription = supabase
      .from('inventoryMaster')
      .on('UPDATE', (payload) => {
        const updatedRecord = payload.new;
        const nprimarykey = updatedRecord.nprimarykey;
        revalidatePage(nprimarykey);
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(subscription);
    };
  }, []);
};

const revalidatePage = async (nprimarykey) => {
  try {
    const revalidatePath = `/nested/${nprimarykey}/`;
    const response = await fetch('/api/revalidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: nprimarykey.toString() }),
    });

    if (response.ok) {
      console.log(`Page revalidated successfully: ${revalidatePath}`);
    } else {
      console.error(`Failed to revalidate page: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error during revalidation:', error);
  }
};

export default useRealTimeUpdates;
