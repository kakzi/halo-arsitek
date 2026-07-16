'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, type ContactFormData } from '../schemas/contact.schema';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSuccess(true);
        reset();
        setTimeout(() => setIsSuccess(false), 5000);
      }
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full bg-[#141414] border border-[#2C2C2E] rounded-md px-4 py-3 text-white focus:outline-none focus:border-[#94A3B8] transition-colors placeholder:text-[#8A8A8E]";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      
      {isSuccess && (
        <div className="bg-[#1a4a2e]/20 border border-[#4ade80]/30 text-[#4ade80] px-4 py-3 rounded-md mb-2">
          Pesan Anda telah terkirim. Kami akan segera menghubungi Anda.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="sr-only">Nama Lengkap</label>
          <input
            id="name"
            placeholder="Nama Lengkap *"
            className={cn(inputClass, errors.name && "border-red-500/50 focus:border-red-500")}
            {...register('name')}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>
        
        <div>
          <label htmlFor="email" className="sr-only">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Alamat Email *"
            className={cn(inputClass, errors.email && "border-red-500/50 focus:border-red-500")}
            {...register('email')}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="phone" className="sr-only">Nomor WhatsApp / Telepon</label>
          <input
            id="phone"
            type="tel"
            placeholder="Nomor WhatsApp / Telepon *"
            className={cn(inputClass, errors.phone && "border-red-500/50 focus:border-red-500")}
            {...register('phone')}
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
        </div>
        
        <div>
          <label htmlFor="budget" className="sr-only">Estimasi Budget (Opsional)</label>
          <select
            id="budget"
            className={cn(inputClass, "appearance-none")}
            {...register('budget')}
          >
            <option value="">Estimasi Budget (Opsional)</option>
            <option value="< 500 Jt">&lt; 500 Juta</option>
            <option value="500 Jt - 1 M">500 Juta - 1 Miliar</option>
            <option value="1 M - 5 M">1 Miliar - 5 Miliar</option>
            <option value="> 5 M">&gt; 5 Miliar</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="sr-only">Detail Proyek</label>
        <textarea
          id="message"
          rows={5}
          placeholder="Ceritakan tentang proyek Anda... *"
          className={cn(inputClass, "resize-y", errors.message && "border-red-500/50 focus:border-red-500")}
          {...register('message')}
        />
        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full md:w-auto self-start mt-2">
        {isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}
      </Button>
    </form>
  );
}
