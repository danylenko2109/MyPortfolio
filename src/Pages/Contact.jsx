import React, { useState, useEffect } from "react";
import { Send, User, Mail, MessageSquare } from "lucide-react";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    AOS.init({
      once: false,
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    Swal.fire({
      title: 'Sending Message...',
      html: 'Please wait while we send your message',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      // Replace with your Telegram bot data
      const TELEGRAM_BOT_TOKEN = '7669574518:AAFqOZIF3fv035YVhF_-8djP4Ub2Yof9tGg'; // Example: '1234567890:ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      const TELEGRAM_CHAT_ID = '8326460941'; // Example: '1234567890'
      
      // Format message for Telegram
      const telegramMessage = `
📬 *New Message from Portfolio Website*

👤 *Name:* ${formData.name}
📧 *Email:* ${formData.email}
📝 *Message:*
${formData.message}

🕒 *Time:* ${new Date().toLocaleString()}
      `;

      // Send message to Telegram via API
      const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: telegramMessage,
          parse_mode: 'Markdown',
          disable_web_page_preview: true,
        }),
      });

      const data = await response.json();

      if (data.ok) {
        Swal.fire({
          title: 'Success!',
          text: 'Your message has been sent successfully!',
          icon: 'success',
          confirmButtonColor: '#6366f1',
          timer: 2000,
          timerProgressBar: true
        });

        // Clear form
        setFormData({
          name: "",
          email: "",
          message: "",
        });
      } else {
        throw new Error(data.description || 'Sending error');
      }

    } catch (error) {
      console.error('Telegram send error:', error);
      
      // Alternative option via FormSubmit if Telegram doesn't work
      if (error.message.includes('bot') || error.message.includes('chat')) {
        // Try sending via FormSubmit as backup
        try {
          const formSubmitUrl = 'https://formsubmit.co/ajax/ekizulfarrachman@gmail.com';
          
          const submitData = new FormData();
          submitData.append('name', formData.name);
          submitData.append('email', formData.email);
          submitData.append('message', formData.message);
          submitData.append('_subject', 'Portfolio: New Message');
          
          const backupResponse = await fetch(formSubmitUrl, {
            method: 'POST',
            body: submitData,
          });

          if (backupResponse.ok) {
            Swal.fire({
              title: 'Success!',
              text: 'Message sent (via backup channel)',
              icon: 'success',
              confirmButtonColor: '#6366f1',
              timer: 2000,
              timerProgressBar: true
            });
            
            setFormData({
              name: "",
              email: "",
              message: "",
            });
          } else {
            throw new Error('Backup sending also failed');
          }
        } catch (backupError) {
          Swal.fire({
            title: 'Error!',
            text: 'Failed to send message. Please try again later or contact via another method.',
            icon: 'error',
            confirmButtonColor: '#6366f1'
          });
        }
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to send message. Please check Telegram bot settings.',
          icon: 'error',
          confirmButtonColor: '#6366f1'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#030014] py-10 sm:py-20 flex items-center justify-center" id="Contact">
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2
            data-aos="fade-down"
            data-aos-duration="1000"
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-center mx-auto text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7] mb-4"
          >
            Get In Touch
          </h2>
          <p
            data-aos="fade-up"
            data-aos-duration="1100"
            className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg mt-4"
          >
            Have questions or want to discuss a project? Fill out the form and I'll get back to you as soon as possible.
          </p>
        </div>

        {/* Contact Form */}
        <div className="w-full flex justify-center">
          <div
            data-aos="zoom-in"
            data-aos-duration="1200"
            className="w-full max-w-2xl bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 transform transition-all duration-500 hover:shadow-[#6366f1]/20 border border-white/10"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl sm:text-3xl font-bold mb-3 text-white">
                Send Me a Message
              </h3>
              <p className="text-gray-400 text-sm sm:text-base">
                Fill out the form below and I'll receive it instantly in Telegram
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div
                data-aos="fade-up"
                data-aos-delay="100"
                className="relative group"
              >
                <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2 ml-1">
                  Your Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#6366f1] transition-colors" />
                  <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full p-4 pl-12 bg-white/10 rounded-xl border border-white/20 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#6366f1]/50 transition-all duration-300 hover:border-[#6366f1]/50 disabled:opacity-50 text-base"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div
                data-aos="fade-up"
                data-aos-delay="150"
                className="relative group"
              >
                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2 ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#6366f1] transition-colors" />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full p-4 pl-12 bg-white/10 rounded-xl border border-white/20 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#6366f1]/50 transition-all duration-300 hover:border-[#6366f1]/50 disabled:opacity-50 text-base"
                    required
                  />
                </div>
              </div>

              {/* Message Field */}
              <div
                data-aos="fade-up"
                data-aos-delay="200"
                className="relative group"
              >
                <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2 ml-1">
                  Your Message
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#6366f1] transition-colors" />
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Write your message here..."
                    value={formData.message}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    rows={6}
                    className="w-full resize-none p-4 pl-12 bg-white/10 rounded-xl border border-white/20 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#6366f1]/50 transition-all duration-300 hover:border-[#6366f1]/50 disabled:opacity-50 text-base"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div data-aos="fade-up" data-aos-delay="250" className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#6366f1]/30 active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-base"
                >
                  <Send className="w-5 h-5" />
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
                
                {/* Sending Info */}
                <p className="text-center text-gray-400 text-xs sm:text-sm mt-4">
                  Message will be sent directly to my Telegram
                </p>
              </div>
            </form>

            
          </div>
        </div>

        {/* Response Time Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            I typically respond within a few hours during business days
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;