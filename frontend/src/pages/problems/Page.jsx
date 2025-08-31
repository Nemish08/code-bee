// src/pages/ProblemsPage.jsx
import React from 'react';
import Problems from './Problems';

function Page() {
  return (
    <div className=' min-h-screen w-[80%] m-auto mt-20 flex justify-center py-8 px-4'>
      <div className='w-full max-w-7xl'>
        <Problems />
      </div>
    </div>
  );
}

export default Page;