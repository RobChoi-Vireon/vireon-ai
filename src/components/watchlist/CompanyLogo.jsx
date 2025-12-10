import React from 'react';

const CompanyLogo = ({ ticker, className }) => {
  // In a real app, you'd have a mapping or a service like Clearbit
  const logoSrc = {
    AAPL: 'https://logo.clearbit.com/apple.com',
    MSFT: 'https://logo.clearbit.com/microsoft.com',
    GOOGL: 'https://logo.clearbit.com/google.com',
    AMZN: 'https://logo.clearbit.com/amazon.com',
    NVDA: 'https://logo.clearbit.com/nvidia.com',
    TSLA: 'https://logo.clearbit.com/tesla.com',
    DIS: 'https://logo.clearbit.com/disney.com',
    PYPL: 'https://logo.clearbit.com/paypal.com',
  }[ticker];

  const fallbackColor = () => {
    let hash = 0;
    for (let i = 0; i < ticker.length; i++) {
      hash = ticker.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
    return "#" + "00000".substring(0, 6 - c.length) + c;
  };
  
  const [imageError, setImageError] = React.useState(false);

  if (logoSrc && !imageError) {
    return (
      <img 
        src={logoSrc} 
        alt={`${ticker} logo`} 
        className={`${className} rounded-xl bg-white/10 backdrop-blur-sm p-2`}
        onError={() => setImageError(true)}
      />
    );
  }

  return (
    <div 
      className={`${className} rounded-xl flex items-center justify-center font-bold text-white text-xl`}
      style={{
        background: `linear-gradient(135deg, ${fallbackColor()}80, ${fallbackColor()}40)`
      }}
    >
      {ticker.charAt(0)}
    </div>
  );
};

export default CompanyLogo;