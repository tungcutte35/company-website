import React, { forwardRef } from "react";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

const Section = forwardRef<HTMLElement, SectionProps>(
  ({ children, className = "", id = "" }, ref) => (
    <section 
      ref={ref}
      id={id} 
      className={`w-full py-16 px-4 md:px-8 max-w-7xl mx-auto ${className}`}
    >
      {children}
    </section>
  )
);

Section.displayName = "Section";

export default Section;
