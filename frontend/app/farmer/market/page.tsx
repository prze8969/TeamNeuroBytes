import { redirect } from 'next/navigation';

export default function MarketIndexPage() {
  // Redirect back to dashboard where the market categories are listed
  redirect('/farmer/dashboard');
}
