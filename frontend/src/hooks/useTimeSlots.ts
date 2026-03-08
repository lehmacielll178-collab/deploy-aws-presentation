import { useState, useEffect } from 'react';
import { format, addMinutes, startOfDay, isSameDay } from 'date-fns';

export type TimeSlot = {
  id: string;
  time: string; // HH:mm
  date: string; // yyyy-MM-dd
  isOccupied: boolean;
};

// Mock database
let mockSlots: TimeSlot[] = [];

// Initialize mock data for the current month
const initializeMockData = () => {
  if (mockSlots.length > 0) return;
  
  const today = new Date();
  const start = startOfDay(today);
  
  // Create slots for today and next 7 days
  for (let d = 0; d < 7; d++) {
    const currentDate = new Date(start);
    currentDate.setDate(currentDate.getDate() + d);
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    
    // Working hours: 09:00 to 18:00
    let currentTime = new Date(currentDate);
    currentTime.setHours(9, 0, 0, 0);
    
    const endTime = new Date(currentDate);
    endTime.setHours(18, 0, 0, 0);
    
    while (currentTime < endTime) {
      mockSlots.push({
        id: `${dateStr}-${format(currentTime, 'HH:mm')}`,
        time: format(currentTime, 'HH:mm'),
        date: dateStr,
        // Randomly occupy some slots
        isOccupied: Math.random() > 0.7,
      });
      currentTime = addMinutes(currentTime, 10);
    }
  }
};

initializeMockData();

export const useTimeSlots = (date: Date) => {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSlots = () => {
    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
      try {
        const dateStr = format(date, 'yyyy-MM-dd');
        const daySlots = mockSlots.filter(s => s.date === dateStr);
        
        // If no slots generated for this day, generate them on the fly
        if (daySlots.length === 0) {
          let currentTime = new Date(date);
          currentTime.setHours(9, 0, 0, 0);
          const endTime = new Date(date);
          endTime.setHours(18, 0, 0, 0);
          
          const newSlots: TimeSlot[] = [];
          while (currentTime < endTime) {
            newSlots.push({
              id: `${dateStr}-${format(currentTime, 'HH:mm')}`,
              time: format(currentTime, 'HH:mm'),
              date: dateStr,
              isOccupied: false,
            });
            currentTime = addMinutes(currentTime, 10);
          }
          mockSlots = [...mockSlots, ...newSlots];
          setSlots(newSlots);
        } else {
          setSlots(daySlots);
        }
        setIsLoading(false);
      } catch (err) {
        setError(err as Error);
        setIsLoading(false);
      }
    }, 100);
  };

  useEffect(() => {
    fetchSlots();
  }, [date]);

  const toggleSlotStatus = async (slotId: string) => {
    setIsLoading(true);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        mockSlots = mockSlots.map(slot => 
          slot.id === slotId ? { ...slot, isOccupied: !slot.isOccupied } : slot
        );
        fetchSlots(); // Refresh current view
        resolve();
      }, 100);
    });
  };

  return { slots, isLoading, error, toggleSlotStatus };
};
