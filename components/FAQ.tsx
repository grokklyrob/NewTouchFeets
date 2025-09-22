
import React from 'react';

const FAQItem: React.FC<{ question: string; children: React.ReactNode }> = ({ question, children }) => (
  <details className="group border-b border-red-900/50 py-4">
    <summary className="font-gothic text-xl tracking-wider text-red-400 cursor-pointer list-none flex justify-between items-center group-hover:text-red-300">
      {question}
      <span className="text-red-500 transition-transform duration-300 transform group-open:rotate-45">+</span>
    </summary>
    <div className="pt-4 text-gray-400">
      {children}
    </div>
  </details>
);

export const FAQ: React.FC = () => {
  return (
    <section className="py-20" id="faq">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-gothic tracking-wider neon-text">Gospels of the Machine</h2>
        <p className="mt-4 text-gray-400">Answers to your most pressing questions.</p>
      </div>
      <div className="max-w-3xl mx-auto">
        <FAQItem question="What is 'Nano Banana'?">
          <p>'Nano Banana' is the codename for Google's powerful `gemini-2.5-flash-image-preview` model. It is the sophisticated AI engine we have sanctified to perform these digital miracles, capable of understanding context and artistic style to edit your images with reverence.</p>
        </FAQItem>
        <FAQItem question="Are my photos safe?">
          <p>We respect your privacy. Uploaded images are sent directly to the AI for processing and are not stored on our servers. The process is designed to be ephemeral and secure, focusing solely on the creation of your unique artwork.</p>
        </FAQItem>
        <FAQItem question="What are the content rules?">
          <p>To maintain the sacred nature of this service, we strictly prohibit images containing nudity (beyond bare feet), identifiable faces of minors, or any hateful or explicit content. All uploads are subject to content safety filters. We aim to provide a respectful and artistic experience.</p>
        </FAQItem>
        <FAQItem question="Why does the free tier have a watermark?">
          <p>The watermark on the free tier helps support the significant computational costs required for each AI generation. Subscribing to a paid plan removes the watermark and provides you with more generations, allowing us to continue offering this service.</p>
        </FAQItem>
      </div>
    </section>
  );
};
