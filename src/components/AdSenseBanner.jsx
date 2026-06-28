import React, { useEffect } from 'react';

const AdSenseBanner = ({ slotId = '1234567890' }) => {
  useEffect(() => {
    // Run only on Web browser, not inside the native Capacitor APK
    if (!window.Capacitor) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.warn('AdSense adsbygoogle push failed (normal during local development):', e);
      }
    }
  }, []);

  // Hide on Mobile APK (since Mobile APK uses AdMob native banner)
  if (window.Capacitor) return null;

  return (
    <div 
      className="adsense-banner-wrapper"
      style={{
        margin: '1.5rem 0',
        padding: '1rem',
        background: 'var(--bg-card)',
        border: '1px dashed var(--border-glass-hover)',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        minHeight: '120px',
        justifyContent: 'center',
        overflow: 'hidden'
      }}
    >
      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
        Sponsor / Iklan
      </span>
      
      {/* Google AdSense Unit */}
      <div style={{ width: '100%', overflow: 'hidden', display: 'flex', justifyContent: 'center' }}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', minWidth: '250px', height: '90px' }}
          data-ad-client="ca-pub-9743604826123010"
          data-ad-slot={slotId}
          data-ad-format="horizontal"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
};

export default AdSenseBanner;
