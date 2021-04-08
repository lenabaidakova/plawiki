import { HEADER_ID } from 'app/constants/common';

export default () => {
  const { location: { hash } } =window;

  if (!hash) return;

  const id = hash.slice(1);
  const element = document.getElementById(id);

  if (!element) return;

  const { top } = element.getBoundingClientRect();
  const yPosition = top + window.pageYOffset;
  const headerHeight = document.getElementById(HEADER_ID).offsetHeight;

  window.scrollTo({ top: yPosition - headerHeight, behavior: 'smooth' });
};
