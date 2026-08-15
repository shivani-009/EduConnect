import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import Button from '../components/Button';

export default function ContactPage() {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 600));
    toast.success("Message sent! We'll get back to you soon.");
    reset();
  };

  return (
    <div className="px-4 md:px-8 pb-6 pt-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Us</h1>
      <div className="mt-4 flex flex-col gap-3 text-sm text-gray-600 dark:text-gray-300">
        <p className="flex items-center gap-2"><FiMail className="text-green-500" /> support@educonnect.com</p>
        <p className="flex items-center gap-2"><FiPhone className="text-green-500" /> +1 (555) 123-4567</p>
        <p className="flex items-center gap-2"><FiMapPin className="text-green-500" /> New York, NY</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
        <input {...register('name', { required: true })} placeholder="Your Name" className="input" />
        <input {...register('email', { required: true })} placeholder="Your Email" type="email" className="input" />
        <textarea {...register('message', { required: true })} rows={4} placeholder="Your Message" className="input" />
        <Button type="submit" loading={isSubmitting} className="w-full">Send Message</Button>
      </form>
    </div>
  );
}
