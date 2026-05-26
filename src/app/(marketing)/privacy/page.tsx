export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-6 pt-32">
      <h1 className="text-4xl font-bold mb-8 text-foreground">Privacy Policy</h1>

      <p className="text-muted-foreground mb-6">
        Effective Date: {new Date().toLocaleDateString()}
      </p>

      <h2 className="text-2xl font-semibold mb-4 text-foreground">Information We Collect</h2>

      <ul className="space-y-3 text-muted-foreground mb-8">
        <li>• Account information (name, email)</li>
        <li>• Saved coding notes and uploaded files</li>
        <li>• Usage analytics for platform improvement</li>
      </ul>

      <h2 className="text-2xl font-semibold mb-4 text-foreground">How We Use Your Data</h2>

      <ul className="space-y-3 text-muted-foreground mb-8">
        <li>• To provide and improve KeepsDSA services</li>
        <li>• To securely store your coding data</li>
        <li>• To enhance learning and revision features</li>
      </ul>

      <h2 className="text-2xl font-semibold mb-4 text-foreground">Data Security</h2>

      <p className="text-muted-foreground mb-8">
        We implement industry-standard security practices to protect your data.
      </p>

      <h2 className="text-2xl font-semibold mb-4 text-foreground">Third-Party Services</h2>

      <p className="text-muted-foreground mb-8">
        KeepsDSA may use trusted third-party services such as authentication,
        database hosting, and cloud storage providers.
      </p>

      <h2 className="text-2xl font-semibold mb-4 text-foreground">Your Rights</h2>

      <p className="text-muted-foreground">
        You may request access, modification, or deletion of your personal data
        at any time.
      </p>
    </div>
  )
}
