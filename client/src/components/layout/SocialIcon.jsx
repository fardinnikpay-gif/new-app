// Small stroke icons drawn here because current lucide-react versions no longer ship brand icons.
const ICONS = {
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" />
    </>
  ),
  x: <path d="M4 4l16 16M20 4L4 20" />,
  facebook: <path d="M17 3h-2.5A4.5 4.5 0 0 0 10 7.5V10H7v4h3v7h4v-7h3l1-4h-4V7.5a.5.5 0 0 1 .5-.5H17z" />,
  youtube: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="4" />
      <path d="M10 9l5 3-5 3z" fill="currentColor" />
    </>
  ),
};

// props: { name: instagram | x | facebook | youtube }
export default function SocialIcon({ name }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {ICONS[name]}
    </svg>
  );
}