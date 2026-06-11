import { format } from 'date-fns';

export function formatMessageTime(value) {
  return format(new Date(value), 'hh:mm a');
}

export function formatMessageDate(value) {
  return format(new Date(value), 'EEE, MMM d');
}

export function getLastSeenLabel(value) {
  if (!value) {
    return 'last seen recently';
  }

  return `last seen ${format(new Date(value), 'PPp')}`;
}
