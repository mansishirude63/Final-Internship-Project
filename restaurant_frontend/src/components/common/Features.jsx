function Features() {
  const features = [
    {
      icon: "🍕",
      title: "Fresh Food",
      description: "Prepared daily with fresh ingredients."
    },
    {
      icon: "🚚",
      title: "Fast Delivery",
      description: "Quick delivery to your doorstep."
    },
    {
      icon: "💳",
      title: "Easy Payment",
      description: "Secure and simple online payment."
    },
    {
      icon: "⭐",
      title: "Best Quality",
      description: "Delicious food with premium quality."
    }
  ];

  return (
    <section className="features">
      <h2>Why Choose Us?</h2>

      <div className="feature-container">
        {features.map((feature, index) => (
          <div className="feature-card" key={index}>
            <div className="feature-icon">{feature.icon}</div>

            <h3>{feature.title}</h3>

            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;