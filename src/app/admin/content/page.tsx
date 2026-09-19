import { requireAdmin } from "@/lib/admin";
import { ensureSiteSettings } from "@/lib/content";
import { saveSiteSettings } from "@/lib/actions";
import { CoverUploader, LogoUploader } from "@/components/admin/media-manager";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default async function AdminContentPage() {
  await requireAdmin();
  const settings = await ensureSiteSettings();

  return (
    <div>
      <h1 className="font-display text-3xl">Site content</h1>
      <p className="mt-2 text-ink-soft/75">
        About, hero text, homepage photos, contact details, and logo.
      </p>

      <form action={saveSiteSettings} className="mt-8 space-y-8">
        <section className="space-y-4 border border-sand-200 p-4">
          <h2 className="font-display text-xl">Logo</h2>
          <p className="text-sm text-ink-soft/70">
            Upload your Smart Arch logo (PNG/SVG preferred). Your PDF can be exported to PNG first.
          </p>
          <LogoUploader initial={settings.logoUrl || ""} />
        </section>

        <section className="space-y-6 border border-sand-200 p-4">
          <div>
            <h2 className="font-display text-xl">Homepage photos</h2>
            <p className="mt-1 text-sm text-ink-soft/70">
              Change the main cover background and the photo next to Our story. Upload a real image
              file (not an Instagram page link). Clear to restore the default Unsplash photos.
            </p>
          </div>
          <CoverUploader
            name="heroImageUrl"
            initial={settings.heroImageUrl || ""}
            label="Hero / cover background"
            helpText="Full-bleed background behind the Smart Arch headline on the homepage."
            buttonLabel="Upload hero photo"
            clearLabel="Clear hero photo (use default)"
            placeholder="/uploads/hero.jpg"
          />
          <CoverUploader
            name="aboutImageUrl"
            initial={settings.aboutImageUrl || ""}
            label="Our story / About photo"
            helpText="Image shown beside the About preview on the homepage."
            buttonLabel="Upload about photo"
            clearLabel="Clear about photo (use default)"
            placeholder="/uploads/about.jpg"
          />
        </section>

        <section className="grid gap-4 border border-sand-200 p-4 sm:grid-cols-2">
          <h2 className="font-display text-xl sm:col-span-2">Contact</h2>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" defaultValue={settings.phone} className="rounded-none" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input id="whatsapp" name="whatsapp" defaultValue={settings.whatsapp} className="rounded-none" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" defaultValue={settings.email} className="rounded-none" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" name="address" defaultValue={settings.address} className="rounded-none" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="instagramUrl">Instagram URL</Label>
            <Input id="instagramUrl" name="instagramUrl" defaultValue={settings.instagramUrl} className="rounded-none" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="instagramHandle">Instagram handle</Label>
            <Input id="instagramHandle" name="instagramHandle" defaultValue={settings.instagramHandle} className="rounded-none" />
          </div>
        </section>

        <section className="space-y-4 border border-sand-200 p-4">
          <h2 className="font-display text-xl">Hero (English)</h2>
          <Input name="heroHeadlineEn" defaultValue={settings.heroHeadlineEn} className="rounded-none" />
          <Textarea name="heroSubEn" defaultValue={settings.heroSubEn} className="rounded-none" rows={3} />
          <h3 className="pt-2 text-sm text-bronze">Arabic / Hebrew optional</h3>
          <Input name="heroHeadlineAr" placeholder="Hero AR" defaultValue={settings.heroHeadlineAr} className="rounded-none" />
          <Textarea name="heroSubAr" placeholder="Sub AR" defaultValue={settings.heroSubAr} className="rounded-none" rows={2} />
          <Input name="heroHeadlineHe" placeholder="Hero HE" defaultValue={settings.heroHeadlineHe} className="rounded-none" />
          <Textarea name="heroSubHe" placeholder="Sub HE" defaultValue={settings.heroSubHe} className="rounded-none" rows={2} />
        </section>

        <section className="space-y-4 border border-sand-200 p-4">
          <h2 className="font-display text-xl">About</h2>
          <Textarea name="aboutEn" defaultValue={settings.aboutEn} className="rounded-none" rows={12} />
          <Textarea name="aboutAr" placeholder="About Arabic" defaultValue={settings.aboutAr} className="rounded-none" rows={6} />
          <Textarea name="aboutHe" placeholder="About Hebrew" defaultValue={settings.aboutHe} className="rounded-none" rows={6} />
        </section>

        <Button type="submit" className="rounded-none">
          Save content
        </Button>
      </form>
    </div>
  );
}
