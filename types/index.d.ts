export type Response<E, T = void> = {
  message: string;
  error?: E;
  success: boolean;
  data?: T;
};

export type NavItem = {
  title: string;
  url: string;
  icon: React.ReactNode;
  items?: {
    title: string;
    url: string;
  }[];
};
