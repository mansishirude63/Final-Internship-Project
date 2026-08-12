function Testimonials() {
  const reviews = [
    {
      id: 1,
      name: "Rahul Sharma",
      review: "Amazing food and super fast delivery. Highly recommended!",
      rating: "⭐⭐⭐⭐⭐",
    },
    {
      id: 2,
      name: "Priya Patel",
      review: "The pizza was fresh and delicious. I loved the service.",
      rating: "⭐⭐⭐⭐⭐",
    },
    {
      id: 3,
      name: "Amit Verma",
      review: "Best online restaurant ordering experience I've had.",
      rating: "⭐⭐⭐⭐⭐",
    },
  ];

  return (
    <section className="testimonials">
      <h2>What Our Customers Say</h2>

      <div className="testimonial-container">
        {reviews.map((review) => (
          <div className="testimonial-card" key={review.id}>
            <h3>{review.name}</h3>
            <p>{review.review}</p>
            <span>{review.rating}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Testimonials;