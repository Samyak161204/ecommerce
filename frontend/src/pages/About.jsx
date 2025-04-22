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
        <img className='w-full md:max-w-[350px] h-[364px]' src={assets.about_img} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p>Parvaz is more than just a platform — it's a movement. Built to empower fashion designers across India, Parvaz offers an easy-to-use digital space where creativity turns into commerce. Whether you’re an emerging artist or a seasoned label, we give you the wings to list, showcase, and sell your creations effortlessly.</p>
          <p>We believe that good design deserves to be seen — and sold. That’s why we’ve built Parvaz to be:</p>
            <b className='text-black'><ul>
              <li>⦿ User-friendly, even for first-time online sellers</li>
              <li>⦿ Accessible across all of India, connecting designers from every corner of the country</li>
              <li>⦿ Unlimited in product listings, so you never have to hold back your creativity</li>
              <li>⦿ Affordable, with minimal platform fees to support your growth</li>
              <li>⦿ Equipped with a simplified, secure payment system, making transactions smooth for everyone</li>
          </ul></b>
          <p>With Parvaz, your brand doesn’t just stay local — it gains wings to reach wardrobes all over India and beyond.</p>
          <p><b className='text-black'>Parvaz – Let your designs soar.</b></p>

          <b className='text-gray-800'>Our Mission</b>
          <p>At Parvaz, our mission is to empower designers from every part of India to turn their creativity into a successful business. We believe that talent should never be limited by access or opportunity. That’s why we’ve created a platform where designers can list unlimited products, enjoy minimal platform fees, and access a simplified, secure payment system. With a user-friendly interface and nationwide availability, we’re committed to making online selling effortless and accessible. Our goal is to help every designer take flight into the world of business, grow their brand, and connect with customers like never before.</p>
        </div>
      </div>
      <div className='text-xl py-4'>
        <Title text1={'WHY '} text2={'CHOOSE US'}/>
      </div>
      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Quality Assurance:</b>
          <p className='text-gray-600'>Parvaz ensures every product meets high standards. From design to delivery, we guarantee quality craftsmanship, helping designers build trust and reputation with customers who value excellence.</p>  
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Convenience:</b>
          <p className='text-gray-600'>Designed for ease, Parvaz simplifies everything—listing, payments, and inventory. Our user-friendly platform empowers designers to focus on creativity, not complexity, making online selling effortless across India.</p>  
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Exceptional Customer Service:</b>
          <p className='text-gray-600'>Our responsive support team is always ready to assist. Whether you're a new seller or seasoned designer, we ensure smooth experiences and timely help, fostering trust and lasting relationships.</p>  
        </div>
      </div>
      <NewsLetterBox/>
    </div>
  )
}

export default About
