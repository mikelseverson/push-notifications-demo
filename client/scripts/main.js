'use strict';

var pushNotificationEnabled = false;
var pushNotificationToggle = document.querySelector('.js-push-button');

pushNotificationToggle.addEventListener('click', function() {
  if (pushNotificationEnabled) unsubscribe();
  else subscribe();
});

if('serviceWorker' in navigator)
  navigator.serviceWorker.register('./sw.js')
    .then(initialiseState);

function initialiseState() {
  // Check if push messaging is supported by the browser
  if (!('PushManager' in window)) {
    console.log('Push messaging isn\'t supported.');
    return;
  }
  // Check if notifications are supported in the service worker
  if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
    console.log('Notifications aren\'t supported.');
    return;
  }
  // Check if for push notifications permission have been denied
  if (Notification.permission === 'denied') {
    console.log('The user has blocked notifications.');
    return;
  }

  // We need the service worker registration to check for a subscription
  navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
    // Check for existing push notification permissions
    serviceWorkerRegistration.pushManager.getSubscription()
      .then(function(pushSubscription) {
        if (!pushSubscription) {
          pushNotificationToggle.textContent = 'Enable Push Messages';
          pushNotificationToggle.disabled = false;
          return;
        }
        else {
          sendSubscriptionToServer(pushSubscription);
          pushNotificationToggle.textContent = 'Disable Push Messages';
          pushNotificationEnabled = true;
        }
      })
      .catch(function(err) {
        console.log('Error during getSubscription()', err);
      });
  });
}

function subscribe() {
  // Disable the button so it can't be changed while
  // push permissions are processed
  pushNotificationToggle.disabled = true;

  navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
    serviceWorkerRegistration.pushManager.subscribe({userVisibleOnly: true})
      .then(function(pushSubscription) {
        // The subscription was successful
        pushNotificationEnabled = true;
        pushNotificationToggle.textContent = 'Disable Push Messages';
        pushNotificationToggle.disabled = false;
        return sendSubscriptionToServer(pushSubscription);
      })
      .catch(function(e) {
        if (Notification.permission === 'denied') {
          console.log('Permission for Notifications was denied');
          pushNotificationToggle.disabled = true;
          pushNotificationToggle.textContent = '';
        } else {
          console.log('Unable to subscribe to push.', e);
          pushNotificationToggle.disabled = false;
          pushNotificationToggle.textContent = 'Enable Push Messages';
        }
      });
  });
}

function unsubscribe() {
  // Disable the button so it can't be changed while
  // push permissions are processed
  pushNotificationToggle.disabled = true;

  navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
    serviceWorkerRegistration.pushManager.getSubscription().then(
      function(pushSubscription) {
        // Check we have a subscription to unsubscribe
        if (!pushSubscription) {
          // No subscription object
          // Allow user to enable push notifications
          pushNotificationEnabled = false;
          pushNotificationToggle.disabled = false;
          pushNotificationToggle.textContent = 'Enable Push Messages';
          return;
        }

        removeSubscriptionFromServer(pushSubscription);

        // We have a subcription, so call unsubscribe on it
        pushSubscription.unsubscribe().then(function() {
          pushNotificationToggle.disabled = false;
          pushNotificationToggle.textContent = 'Enable Push Messages';
          pushNotificationEnabled = false;
        }).catch(function(e) {
          console.log('Unsubscription error: ', e);
          pushNotificationToggle.disabled = false;
        });
      }).catch(function(e) {
        console.log('Error thrown while unsubscribing from ' +
          'push messaging.', e);
      });
  });
}

function sendSubscriptionToServer(pushSubscription) {
  var mergedEndpoint = endpointWorkaround(pushSubscription);
  console.log(mergedEndpoint);
}

function removeSubscriptionFromServer(pushSubscription) {
  var mergedEndpoint = endpointWorkaround(pushSubscription);
  console.log(mergedEndpoint);
}

// This method handles the removal of subscriptionId
// in Chrome 44 by concatenating the subscription Id
// to the subscription endpoint
function endpointWorkaround(pushSubscription) {
  // Make sure we only mess with GCM
  if (pushSubscription.endpoint.indexOf('https://android.googleapis.com/gcm/send') !== 0) {
    return pushSubscription.endpoint;
  }

  var mergedEndpoint = pushSubscription.endpoint;
  // Chrome 42 + 43 will not have the subscriptionId attached
  // to the endpoint.
  if (pushSubscription.subscriptionId &&
    pushSubscription.endpoint.indexOf(pushSubscription.subscriptionId) === -1) {
    // Handle version 42 where you have separate subId and Endpoint
    mergedEndpoint = pushSubscription.endpoint + '/' +
      pushSubscription.subscriptionId;
  }
  return mergedEndpoint;
}
