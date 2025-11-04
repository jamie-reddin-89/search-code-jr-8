import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import TopRightControls from "@/components/TopRightControls";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { getDeviceBySlug, getDeviceErrorCodes, type DeviceWithBrand } from "@/lib/deviceManager";

export default function DevicePage() {
  const { slug } = useParams<{ slug: string }>();
  const [device, setDevice] = useState<DeviceWithBrand | null>(null);
  const [codes, setCodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!slug) return;
      setLoading(true);
      const d = await getDeviceBySlug(slug);
      if (mounted) setDevice(d);
      if (d) {
        const ec = await getDeviceErrorCodes(d.id);
        if (mounted) setCodes(ec);
      }
      if (mounted) setLoading(false);
    };
    load();
    return () => { mounted = false; };
  }, [slug]);

  return (
    <div className="page-container">
      <TopRightControls />

      <header className="flex items-center justify-between mb-8 w-full max-w-4xl">
        <div className="flex items-center gap-2">
          <Link to="/">
            <Button variant="ghost" size="icon" aria-label="Back to Home">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/">
            <Button variant="ghost" size="icon" aria-label="Go home">
              <Home className="h-5 w-5" />
            </Button>
          </Link>
        </div>
        <h1 className="text-2xl font-bold">
          {device ? `${device.brand?.name ?? ""} ${device.name}` : "Device"}
        </h1>
        <div className="w-10" />
      </header>

      {loading && (
        <div className="w-full max-w-4xl">Loading...</div>
      )}

      {!loading && !device && (
        <div className="w-full max-w-4xl">Device not found.</div>
      )}

      {device && (
        <div className="w-full max-w-4xl space-y-6">
          <section className="border rounded-lg p-4">
            <h2 className="font-semibold mb-2">Device Details</h2>
            <div className="text-sm text-muted-foreground">
              <div><span className="font-medium">Brand:</span> {device.brand?.name}</div>
              <div><span className="font-medium">Model:</span> {device.name}</div>
              {device.description && (
                <div className="mt-1"><span className="font-medium">Description:</span> {device.description}</div>
              )}
            </div>
          </section>

          <section className="border rounded-lg p-4">
            <h2 className="font-semibold mb-2">Error Codes</h2>
            {codes.length === 0 ? (
              <div className="text-sm text-muted-foreground">No error codes found.</div>
            ) : (
              <ul className="space-y-2">
                {codes.map((c) => (
                  <li key={c.id} className="p-3 border rounded bg-muted/50">
                    <div className="font-medium">{c.code}</div>
                    {c.meaning && <div className="text-sm text-muted-foreground">{c.meaning}</div>}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
