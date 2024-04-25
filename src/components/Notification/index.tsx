import React, { useEffect, useState } from "react";
import { initializeApp } from 'firebase/app';
import { MessagePayload, deleteToken, getMessaging, getToken, onMessage } from 'firebase/messaging';
import { firebaseConfig, vapidKey } from '@/config';

initializeApp(firebaseConfig);
const messaging = getMessaging();

const NotificationComp = () => {

    const [message, setMessage] = useState<string>('');

    function sendTokenToServer(currentToken: string) {
      if (!isTokenSentToServer()) {
        console.log('Sending token to server...', currentToken);
        // TODO(developer): Send the current token to your server.
        setTokenSentToServer(true);
      } else {
        console.log('Token already sent to server so won\'t send it again unless it changes');
      }
    }
  
    function isTokenSentToServer() {
      return window.localStorage.getItem('sentToServer') === '1';
    }
  
    function setTokenSentToServer(sent: boolean) {
      window.localStorage.setItem('sentToServer', sent ? '1' : '0');
    }
  
    const resetUI = () => {
      setMessage('loading...');
      // Get registration token. Initially this makes a network call, once retrieved
      // subsequent calls to getToken will return from cache.
      getToken(messaging, { vapidKey }).then((currentToken) => {
        if (currentToken) {
          sendTokenToServer(currentToken);
          // updateUIForPushEnabled(currentToken);
        } else {
          // Show permission request.
          console.log('No registration token available. Request permission to generate one.');
          // Show permission UI.
          // updateUIForPushPermissionRequired();
          setTokenSentToServer(false);
        }
      }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
        setMessage('Error retrieving registration token.');
        setTokenSentToServer(false);
      });
    }
  
    const deleteTokenFromFirebase = () => {
      // Delete registration token.
      getToken(messaging).then((currentToken) => {
        deleteToken(messaging).then(() => {
          console.log('Token deleted.', currentToken);
          setTokenSentToServer(false);
          // Once token is deleted update UI.
          resetUI();
        }).catch((err) => {
          console.log('Unable to delete token. ', err);
        });
      }).catch((err) => {
        console.log('Error retrieving registration token. ', err);
        setMessage('Error retrieving registration token.');
      });
    }
  
    const requestPermission = () => {
      console.log('Requesting permission...');
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          console.log('Notification permission granted.');
          // TODO(developer): Retrieve a registration token for use with FCM.
          // In many cases once an app has been granted notification permission,
          // it should update its UI reflecting this.
          resetUI();
        } else {
          console.log('Unable to get permission to notify.');
        }
      });
    }

    useEffect(() => {
        // Handle incoming messages. Called when:
        // - a message is received while the app has focus
        // - the user clicks on an app notification created by a service worker
        //   `messaging.onBackgroundMessage` handler.
        onMessage(messaging, (payload) => {
          console.log('Message received. ', payload);
          // Update the UI to include the received message.
        });
    
        resetUI();
    
      }, [])
    return (
        <div>
            <h1>Notification</h1>
            <div className="w-full font-mono text-sm">
                <h3>Message</h3>
                <p>{message}</p>
                <div>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={requestPermission}>Request Permission</button>
                    <br />
                    <br />
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={deleteTokenFromFirebase}>Cancel Push</button>
                </div>
            </div>
        </div>
    );
}

export default NotificationComp;