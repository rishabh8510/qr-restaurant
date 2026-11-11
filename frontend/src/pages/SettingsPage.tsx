import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRestaurant, useUpdateRestaurant } from '@/hooks';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Loader } from '@/components/ui/Loader';
import { Settings, User, Percent, Sliders, CheckCircle2, Shield } from 'lucide-react';

type WebsitePricing = {
  taxPercent: number;
  firstOrderDiscountPercent: number;
  firstOrderDiscountEnabled: boolean;
  deliveryCharge: number;
  packingCharge: number;
};

type WebsiteSettings = {
  showBanner: boolean;
  showDishOfTheDay: boolean;
  showOffers: boolean;
  showSearch: boolean;
  showCategoryFilter: boolean;
  showSubCategoryFilter: boolean;
  filters: {
    veg: boolean;
    nonveg: boolean;
    vegan: boolean;
    egg: boolean;
    new: boolean;
    bestseller: boolean;
  };
  pricing: WebsitePricing;
};

const DEFAULT: WebsiteSettings = {
  showBanner: true,
  showDishOfTheDay: true,
  showOffers: true,
  showSearch: true,
  showCategoryFilter: true,
  showSubCategoryFilter: true,
  filters: {
    veg: true,
    nonveg: true,
    vegan: true,
    egg: true,
    new: true,
    bestseller: true,
  },
  pricing: {
    taxPercent: 5,
    firstOrderDiscountPercent: 10,
    firstOrderDiscountEnabled: false,
    deliveryCharge: 0,
    packingCharge: 0,
  },
};

function mergeSettings(raw: unknown): WebsiteSettings {
  const base: WebsiteSettings = JSON.parse(JSON.stringify(DEFAULT));
  if (!raw || typeof raw !== 'object') return base;
  const s = raw as Record<string, unknown>;
  const website = (s.website && typeof s.website === 'object' ? s.website : s) as Record<
    string,
    unknown
  >;

  (Object.keys(base) as (keyof WebsiteSettings)[]).forEach((key) => {
    if (key === 'filters' || key === 'pricing') return;
    if (typeof website[key] === 'boolean') {
      base[key] = website[key];
    }
  });

  if (website.filters && typeof website.filters === 'object') {
    const f = website.filters as Record<string, unknown>;
    (Object.keys(base.filters) as (keyof WebsiteSettings['filters'])[]).forEach((k) => {
      if (typeof f[k] === 'boolean') base.filters[k] = f[k] as boolean;
    });
  }

  if (website.pricing && typeof website.pricing === 'object') {
    const p = website.pricing as Record<string, unknown>;
    if (typeof p.taxPercent === 'number' && !Number.isNaN(p.taxPercent)) {
      base.pricing.taxPercent = p.taxPercent;
    }
    if (
      typeof p.firstOrderDiscountPercent === 'number' &&
      !Number.isNaN(p.firstOrderDiscountPercent)
    ) {
      base.pricing.firstOrderDiscountPercent = p.firstOrderDiscountPercent;
    }
    if (typeof p.firstOrderDiscountEnabled === 'boolean') {
      base.pricing.firstOrderDiscountEnabled = p.firstOrderDiscountEnabled;
    }
    if (typeof p.deliveryCharge === 'number' && !Number.isNaN(p.deliveryCharge)) {
      base.pricing.deliveryCharge = p.deliveryCharge;
    }
    if (typeof p.packingCharge === 'number' && !Number.isNaN(p.packingCharge)) {
      base.pricing.packingCharge = p.packingCharge;
    }
  }

  return base;
}

export function SettingsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const { data, isLoading } = useRestaurant();
  const mutation = useUpdateRestaurant();
  const [website, setWebsite] = useState<WebsiteSettings>(DEFAULT);
  const [success, setSuccess] = useState(false);

  const [syncedDataKey, setSyncedDataKey] = useState<string | null>(null);
  const dataKey = data?.data
    ? `${(data.data as { id?: string }).id ?? ''}::${JSON.stringify(
        (data.data as { settings?: unknown }).settings ?? null
      )}`
    : null;

  if (dataKey && dataKey !== syncedDataKey) {
    setSyncedDataKey(dataKey);
    setWebsite(mergeSettings(data?.data?.settings));
  }

  const toggleSection = (key: keyof Omit<WebsiteSettings, 'filters' | 'pricing'>) => {
    setWebsite((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleFilter = (key: keyof WebsiteSettings['filters']) => {
    setWebsite((prev) => ({
      ...prev,
      filters: { ...prev.filters, [key]: !prev.filters[key] },
    }));
  };

  const updatePricing = <K extends keyof WebsitePricing>(key: K, value: WebsitePricing[K]) => {
    setWebsite((prev) => ({
      ...prev,
      pricing: { ...prev.pricing, [key]: value },
    }));
  };

  const save = () => {
    const form = new FormData();
    if (data?.data?.name) form.append('name', data.data.name);
    form.append(
      'settings',
      JSON.stringify({
        ...(typeof data?.data?.settings === 'object' && data?.data?.settings
          ? (data.data.settings as Record<string, unknown>)
          : {}),
        website,
      })
    );
    mutation.mutate(form, {
      onSuccess: () => {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2500);
      },
    });
  };

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-gray-900">System &amp; Web Settings</h1>
        <p className="text-xs font-medium text-gray-500">
          Configure taxes, GST invoicing, ordering fees, and website visibility toggles
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Account Info Card */}
        <Card className="lg:col-span-1 border-gray-100 bg-white">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <span>Session Account</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Name</p>
              <p className="font-bold text-gray-900">{user?.name}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Email Address</p>
              <p className="font-medium text-gray-700">{user?.email}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">System Role</p>
              <Badge variant="outline" className="mt-1 gap-1 capitalize font-bold">
                <Shield className="h-3 w-3 text-gray-500" />
                <span>{user?.role}</span>
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Configurations Card */}
        {isAdmin ? (
          <div className="lg:col-span-2 space-y-6">
            {success && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-xs font-semibold text-emerald-800">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>Settings saved successfully! Updated rules apply to new orders immediately.</span>
              </div>
            )}

            {/* Taxes & Charges */}
            <Card className="border-gray-100 bg-white">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Percent className="h-4 w-4 text-emerald-600" />
                  <span>GST &amp; Pricing Calculations</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <Input
                    label="GST Tax Total (%)"
                    type="number"
                    min={0}
                    max={100}
                    step={0.5}
                    value={website.pricing.taxPercent}
                    onChange={(e) => updatePricing('taxPercent', Number(e.target.value) || 0)}
                  />
                  <Input
                    label="Delivery Charge (₹)"
                    type="number"
                    min={0}
                    value={website.pricing.deliveryCharge}
                    onChange={(e) => updatePricing('deliveryCharge', Number(e.target.value) || 0)}
                  />
                  <Input
                    label="Packing Charge (₹)"
                    type="number"
                    min={0}
                    value={website.pricing.packingCharge}
                    onChange={(e) => updatePricing('packingCharge', Number(e.target.value) || 0)}
                  />
                </div>
                <p className="text-[11px] text-gray-400">
                  GST is split equally between CGST and SGST on customer receipts.
                </p>

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-gray-900">First-Order Welcome Discount</p>
                      <p className="text-xs text-gray-500">Apply a discount on customer&apos;s first completed order</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={website.pricing.firstOrderDiscountEnabled}
                      onChange={() =>
                        updatePricing(
                          'firstOrderDiscountEnabled',
                          !website.pricing.firstOrderDiscountEnabled
                        )
                      }
                      className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                    />
                  </div>

                  {website.pricing.firstOrderDiscountEnabled && (
                    <div className="mt-3 max-w-xs">
                      <Input
                        label="First-Order Discount (%)"
                        type="number"
                        min={1}
                        max={100}
                        value={website.pricing.firstOrderDiscountPercent}
                        onChange={(e) =>
                          updatePricing('firstOrderDiscountPercent', Number(e.target.value) || 0)
                        }
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Website Public Visibility */}
            <Card className="border-gray-100 bg-white">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-blue-600" />
                  <span>Website Sections Visibility</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {(
                    [
                      ['showBanner', 'Promotional Carousel Banner'],
                      ['showDishOfTheDay', 'Chef Dish of the Day'],
                      ['showOffers', 'Menu Item Offer Badges'],
                      ['showSearch', 'Live Search Bar'],
                      ['showCategoryFilter', 'Category Navigation Bar'],
                      ['showSubCategoryFilter', 'Sub-category Chips'],
                    ] as const
                  ).map(([key, label]) => (
                    <label
                      key={key}
                      className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-100 bg-gray-50/50 p-3 hover:bg-gray-100/50 transition-colors"
                    >
                      <span className="text-xs font-semibold text-gray-800">{label}</span>
                      <input
                        type="checkbox"
                        checked={website[key]}
                        onChange={() => toggleSection(key)}
                        className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                      />
                    </label>
                  ))}
                </div>

                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={save}
                    variant="default"
                    className="bg-gray-900 text-white hover:bg-black font-bold px-6"
                    loading={mutation.isPending}
                  >
                    Save All Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="lg:col-span-2">
            <Card className="p-6 text-center text-sm text-gray-500">
              Only restaurant administrators have permission to modify pricing and public website configuration.
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
