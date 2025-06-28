import * as React from 'react';

interface EmailTemplateProps {
  firstName: string,
  otp: string,
}

export function EmailTemplate({ firstName }: EmailTemplateProps ,{otp}: EmailTemplateProps) {
  return (
    <div>
      <h1 className='items-center'>Welcome, {firstName}!</h1>
      <br/>
      <h2 className='font-bold text-xl text-center'>Your OTP is: {otp}</h2>
    </div>
  );
}