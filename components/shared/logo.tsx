'use client';

import { useTheme } from 'next-themes';
import React from 'react';

interface AppLogoProps {
  withText?: boolean;
  className?: string;
}

const AppLogo = ({ className, withText }: AppLogoProps) => {
  const { theme } = useTheme();

  if (withText) {
    switch (theme) {
      case 'light':
        return <LightLogoWithText className={className} />;
      case 'dark':
        return <DarkLogoWithText className={className} />;
      default:
        return <LightLogoWithText className={className} />;
    }
  } else {
    switch (theme) {
      case 'light':
        return <LightLogo className={className} />;
      case 'dark':
        return <DarkLogo className={className} />;
      default:
        return <LightLogo className={className} />;
    }
  }
};

export default AppLogo;

const LightLogoWithText: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="128" height="24" fill="none" viewBox="0 0 128 48" {...props}>
    <path
      fill="#000"
      d="M38.034 46V11.09h13.773q3.971 0 6.767 1.518 2.796 1.5 4.261 4.176 1.483 2.659 1.483 6.137t-1.5 6.136-4.346 4.142q-2.83 1.483-6.853 1.483h-8.778v-5.915h7.585q2.13 0 3.511-.733 1.398-.75 2.08-2.062.699-1.33.699-3.052 0-1.738-.699-3.034-.682-1.312-2.08-2.028-1.397-.733-3.545-.733h-4.977V46zm30.942 0V19.818h7.261V46zm3.648-29.557q-1.62 0-2.779-1.074-1.142-1.09-1.142-2.608 0-1.5 1.142-2.573 1.16-1.091 2.779-1.091 1.62 0 2.76 1.09 1.16 1.074 1.16 2.574 0 1.518-1.16 2.608-1.14 1.074-2.76 1.074m23.356 3.375v5.455H80.213v-5.455zm-12.187-6.273h7.261v24.41q0 1.005.307 1.568.306.545.852.767.563.222 1.296.221.51 0 1.022-.085.511-.103.784-.153l1.142 5.403q-.545.17-1.534.392-.989.24-2.403.29-2.625.102-4.602-.699-1.96-.801-3.052-2.489-1.09-1.688-1.073-4.26zM100.71 46V19.818h7.262V46zm3.648-29.557q-1.62 0-2.778-1.074-1.142-1.09-1.142-2.608 0-1.5 1.142-2.573 1.158-1.091 2.778-1.091t2.761 1.09q1.16 1.074 1.159 2.574 0 1.518-1.159 2.608-1.141 1.074-2.761 1.074"
    ></path>
    <path
      fill="var(--color-primary)"
      d="M118.033 46.443q-1.687 0-2.898-1.193-1.194-1.21-1.193-2.898 0-1.67 1.193-2.863 1.21-1.194 2.898-1.194 1.636 0 2.863 1.194t1.228 2.863a3.85 3.85 0 0 1-.58 2.063 4.4 4.4 0 0 1-1.483 1.483 3.9 3.9 0 0 1-2.028.545M-.002 17.843 30.903 0l-.819 12.7-26.32 15.196z"
    ></path>
    <path fill="var(--color-primary)" d="m3.764 27.895 21.735-12.55-.819 12.7-17.15 9.902z" opacity="0.5"></path>
    <path fill="var(--color-primary)" d="m7.527 37.948 12.566-7.255-.819 12.7L11.294 48z" opacity="0.25"></path>
  </svg>
);

const DarkLogoWithText: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="128" height="24" fill="none" viewBox="0 0 128 48" {...props}>
    <path
      fill="#fff"
      d="M38.034 46V11.09h13.773q3.971 0 6.767 1.518 2.796 1.5 4.261 4.176 1.483 2.659 1.483 6.137t-1.5 6.136-4.346 4.142q-2.83 1.483-6.853 1.483h-8.778v-5.915h7.585q2.13 0 3.511-.733 1.398-.75 2.08-2.062.699-1.33.699-3.052 0-1.738-.699-3.034-.682-1.312-2.08-2.028-1.397-.733-3.545-.733h-4.977V46zm30.942 0V19.818h7.261V46zm3.648-29.557q-1.62 0-2.779-1.074-1.142-1.09-1.142-2.608 0-1.5 1.142-2.573 1.16-1.091 2.779-1.091 1.62 0 2.76 1.09 1.16 1.074 1.16 2.574 0 1.518-1.16 2.608-1.14 1.074-2.76 1.074m23.356 3.375v5.455H80.213v-5.455zm-12.187-6.273h7.261v24.41q0 1.005.307 1.568.306.545.852.767.563.222 1.296.221.51 0 1.022-.085.511-.103.784-.153l1.142 5.403q-.545.17-1.534.392-.989.24-2.403.29-2.625.102-4.602-.699-1.96-.801-3.052-2.489-1.09-1.688-1.073-4.26zM100.71 46V19.818h7.262V46zm3.648-29.557q-1.62 0-2.778-1.074-1.142-1.09-1.142-2.608 0-1.5 1.142-2.573 1.158-1.091 2.778-1.091t2.761 1.09q1.16 1.074 1.159 2.574 0 1.518-1.159 2.608-1.141 1.074-2.761 1.074m13.675 30q-1.687 0-2.898-1.193-1.194-1.21-1.193-2.898 0-1.67 1.193-2.863 1.21-1.194 2.898-1.194 1.636 0 2.863 1.194t1.228 2.863a3.85 3.85 0 0 1-.58 2.063 4.4 4.4 0 0 1-1.483 1.483 3.9 3.9 0 0 1-2.028.545"
      opacity="0.85"
    ></path>
    <path fill="#fff" d="M-.002 17.843 30.903 0l-.819 12.7-26.32 15.196z"></path>
    <path fill="#fff" d="m3.764 27.895 21.735-12.55-.819 12.7-17.15 9.902z" opacity="0.5"></path>
    <path fill="#fff" d="m7.527 37.948 12.566-7.255-.819 12.7L11.294 48z" opacity="0.25"></path>
  </svg>
);

const LightLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="31" height="48" fill="none" viewBox="0 0 31 48" {...props}>
    <path fill="var(--color-primary)" d="M-.002 17.843 30.903 0l-.819 12.7-26.32 15.196z"></path>
    <path fill="var(--color-primary)" d="m3.764 27.895 21.735-12.55-.819 12.7-17.15 9.902z" opacity="0.5"></path>
    <path fill="var(--color-primary)" d="m7.527 37.948 12.566-7.255-.819 12.7L11.294 48z" opacity="0.25"></path>
  </svg>
);

const DarkLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="31" height="48" fill="none" viewBox="0 0 31 48" {...props}>
    <path fill="#fff" d="M-.002 17.843 30.903 0l-.819 12.7-26.32 15.196z"></path>
    <path fill="#fff" d="m3.764 27.895 21.735-12.55-.819 12.7-17.15 9.902z" opacity="0.5"></path>
    <path fill="#fff" d="m7.527 37.948 12.566-7.255-.819 12.7L11.294 48z" opacity="0.25"></path>
  </svg>
);
