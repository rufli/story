import { getToken } from '../utils/auth';
import { BASE_URL } from '../config';

const ENDPOINTS = {
  // Auth
  REGISTER: `${BASE_URL}/register`,
  LOGIN: `${BASE_URL}/login`,

  // Story
  STORY_LIST: `${BASE_URL}/stories`,
  STORY_DETAIL: (id) => `${BASE_URL}/stories/${id}`,
  STORE_story_STORY: `${BASE_URL}/stories`,
  STORE_story_STORY_GUEST: `${BASE_URL}/stories/guest`,

  // Push Notification
  SUBSCRIBE: `${BASE_URL}/notifications/subscribe`,
  UNSUBSCRIBE: `${BASE_URL}/notifications/subscribe`,
};
export async function getData() {
  
  const fetchResponse = await fetch(ENDPOINTS.STORY_LIST); 
  return await fetchResponse.json();
}
// === Auth ===
export async function getRegistered({ name, email, password }) {
  const data = JSON.stringify({ name, email, password });

  const fetchResponse = await fetch(ENDPOINTS.REGISTER, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: data,
  });

  const json = await fetchResponse.json();
  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function getLogin({ email, password }) {
  const data = JSON.stringify({ email, password });

  const fetchResponse = await fetch(ENDPOINTS.LOGIN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: data,
  });

  const json = await fetchResponse.json();
  return {
    ...json,
    ok: fetchResponse.ok,
  };
}


export async function getAllStories() {
  const token = getToken();

  const fetchResponse = await fetch(ENDPOINTS.STORY_LIST, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function getStoryById(id) {
  const token = getToken();

  const fetchResponse = await fetch(ENDPOINTS.STORY_DETAIL(id), {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function storestoryStory(formData) {
  const token = getToken();

  const fetchResponse = await fetch(ENDPOINTS.STORE_story_STORY, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const json = await fetchResponse.json();
  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function storestoryStoryAsGuest(formData) {
  const fetchResponse = await fetch(ENDPOINTS.STORE_story_STORY_GUEST, {
    method: 'POST',
    body: formData,
  });

  const json = await fetchResponse.json();
  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

// === Web Push Notifications ===
export async function subscribePushNotification({ endpoint, keys: { p256dh, auth } }) {
  const token = getToken();
  const data = JSON.stringify({
    endpoint,
    keys: { p256dh, auth },
  });

  const fetchResponse = await fetch(ENDPOINTS.SUBSCRIBE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: data,
  });

  const json = await fetchResponse.json();
  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function unsubscribePushNotification({ endpoint }) {
  const token = getToken();
  const data = JSON.stringify({ endpoint });

  const fetchResponse = await fetch(ENDPOINTS.UNSUBSCRIBE, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: data,
  });

  const json = await fetchResponse.json();
  return {
    ...json,
    ok: fetchResponse.ok,
  };
}
