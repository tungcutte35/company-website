import React from "react";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

const Section: React.FC<SectionProps> = ({ children, className = "", id = "" }) => (
  <section id={id} className={`w-full py-16 px-4 md:px-8 max-w-7xl mx-auto ${className}`}>
    {children}
  </section>
);

export default Section;
