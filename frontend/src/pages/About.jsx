import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsLetterBox from '../components/NewsLetterBox'

const About = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT '} text2={'US'}/>
      </div>
      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore dolores id sit quaerat est rem maiores eaque recusandae eius sint. Molestiae nemo voluptatem facere deserunt. Sint animi maiores accusantium illo!</p>
          <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ducimus expedita saepe, pariatur iure repellat quam, odio nihil ipsa, tenetur iste similique deleniti quos ea eaque eligendi vitae! Ipsam esse debitis placeat quis odit nesciunt nostrum a quaerat modi, aliquam delectus veniam in alias sunt consequuntur.</p>
          <b className='text-gray-800'>Our Mission</b>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic doloribus, asperiores et veritatis odit quidem eum consequatur voluptatibus beatae in aliquid expedita architecto aperiam accusantium distinctio, reprehenderit impedit illo. Enim a ad, autem, magnam debitis quisquam illum asperiores, numquam quibusdam quasi officia quod ex cupiditate ipsam dignissimos! Deleniti, illum adipisci.</p>
        </div>
      </div>
      <div className='text-xl py-4'>
        <Title text1={'WHY '} text2={'CHOOSE US'}/>
      </div>
      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Quality Assurance:</b>
          <p className='text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui ducimus dignissimos saepe similique quisquam sapiente r delectus adipisci porro.</p>  
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Convenience:</b>
          <p className='text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui ducimus dignissimos saepe similique quisquam sapiente est lectus adipisci porro.</p>  
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Exceptional Customer Service:</b>
          <p className='text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui ducimus dignissimos saepe similique quisquam sapiente est lectus adipisci porro.</p>  
        </div>
      </div>
      <NewsLetterBox/>
    </div>
  )
}

export default About
