import React from 'react';
import { Ui_url } from './env_variable';

export const withAuth = (WrappedComponent) => {
  return (props) => {
    // Check if the user is authenticated based on session storage or any other logic.
    const isAuthenticated = sessionStorage.getItem('token');

    if (!isAuthenticated) {
      // If the user is not authenticated, you can redirect them to a login page
      // or another route of your choice.
      // Example: Redirect to the login page.
      window.open(Ui_url+ "login", "_self");
      return null;
    }
    // Return the WrappedComponent with its props if the user is authenticated.
    return WrappedComponent() 
  };
};

export default withAuth;