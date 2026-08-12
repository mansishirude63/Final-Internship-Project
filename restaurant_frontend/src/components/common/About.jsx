function About() {
  return (
    <section className="about">
      <div className="about-content">
        <h2>About Our Restaurant</h2>

        <p>
          Welcome to our Restaurant Ordering System! We serve fresh,
          delicious, and high-quality food prepared with the finest
          ingredients. Our goal is to provide a fast, easy, and enjoyable
          food ordering experience for every customer.
        </p>

        <p>
          Whether you're craving pizza, burgers, pasta, or refreshing drinks,
          we've got something for everyone. Order online and enjoy quick
          delivery right to your doorstep.
        </p>

        <button>Learn More</button>
      </div>

      <div className="about-image">
        <img
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
          alt="Restaurant"
        />
      </div>
    </section>
  );
}

export default About;