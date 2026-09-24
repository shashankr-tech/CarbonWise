import Navbar from "../components/Navbar";

function Landing() {
  return (
    <div className="landing-page">

      <Navbar />

      {/* Hero Section */}

      <section className="hero-section">

        <div className="hero-content">

          <p className="hero-label">
            YOUR JOURNEY TO A GREENER FUTURE
          </p>

          <h1>
            Track.
            <br />
            Reduce.
            <br />
            <span>Sustain.</span>
          </h1>

          <p className="hero-description">
            Understand your carbon footprint, track your daily
            activities, and make more sustainable choices for
            a healthier planet.
          </p>

          <div className="hero-buttons">

            <button className="primary-button">
              Get Started
            </button>

            <button className="secondary-button">
              Learn More
            </button>

          </div>

        </div>

        <div className="hero-visual">

          <div className="dashboard-preview">

            <div className="preview-header">
              <span>CarbonWise</span>
              <span>●</span>
            </div>

            <div className="preview-card">

              <p>Today's Emissions</p>

              <h2>12.4</h2>

              <span>kg CO₂e</span>

            </div>

            <div className="preview-chart">

              <div className="chart-line"></div>

            </div>

          </div>

        </div>

      </section>


      {/* Features */}

      <section
        className="features-section"
        id="features"
      >

        <div className="section-heading">

          <p className="section-label">
            FEATURES
          </p>

          <h2>
            Everything you need to understand
            <br />
            your carbon footprint.
          </h2>

        </div>


        <div className="feature-cards">

          <div className="feature-card">

            <div className="feature-icon">
              🌱
            </div>

            <h3>
              Track Your Impact
            </h3>

            <p>
              Record your everyday activities and
              estimate the carbon emissions they create.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              📊
            </div>

            <h3>
              Understand Your Data
            </h3>

            <p>
              See where your emissions come from
              and understand your environmental impact.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              🌍
            </div>

            <h3>
              Build Better Habits
            </h3>

            <p>
              Use your carbon data to make smarter
              and more sustainable decisions.
            </p>

          </div>

        </div>

      </section>
      {/* How It Works */}

<section
  className="how-it-works-section"
  id="how-it-works"
>

  <div className="section-heading">

    <p className="section-label">
      HOW IT WORKS
    </p>

    <h2>
      Track your footprint in three simple steps.
    </h2>

  </div>

  <div className="steps-container">

    <div className="step-card">

      <div className="step-number">
        01
      </div>

      <h3>
        Record Your Activity
      </h3>

      <p>
        Enter information about your transportation,
        electricity, household fuel, or water usage.
      </p>

    </div>


    <div className="step-card">

      <div className="step-number">
        02
      </div>

      <h3>
        Calculate Your Footprint
      </h3>

      <p>
        CarbonWise uses your activity data and
        emission factors to estimate your carbon footprint.
      </p>

    </div>


    <div className="step-card">

      <div className="step-number">
        03
      </div>

      <h3>
        Understand & Reduce
      </h3>

      <p>
        View your history and analytics to understand
        where your emissions come from.
      </p>

    </div>

  </div>

</section>


{/* About */}

<section
  className="about-section"
  id="about"
>

  <div className="about-content">

    <p className="section-label">
      ABOUT CARBONWISE
    </p>

    <h2>
      Understand your impact.
      Make better choices.
    </h2>

    <p>
      CarbonWise is a personal carbon footprint tracker
      designed to help users understand the environmental
      impact of their everyday activities.
    </p>

    <p>
      By tracking transportation, electricity, household
      fuel, and water consumption, users can see their
      emissions over time and identify areas where they
      can reduce their impact.
    </p>

  </div>

  <div className="about-highlight">

    <div className="about-icon">
      🌱
    </div>

    <h3>
      Track. Reduce. Sustain.
    </h3>

    <p>
      Small changes in everyday habits can contribute
      to a more sustainable future.
    </p>

  </div>

</section>


      {/* Impact Section */}

      <section
        className="impact-section"
        id="impact"
      >

        <div>

          <p className="section-label">
            YOUR IMPACT
          </p>

          <h2>
            Small changes can make
            a big difference.
          </h2>

          <p>
            CarbonWise helps you understand your
            everyday impact so you can gradually
            reduce your emissions.
          </p>

        </div>


        <div className="impact-stats">

          <div>
            <h3>245.6</h3>
            <p>kg CO₂e tracked</p>
          </div>

          <div>
            <h3>38.2</h3>
            <p>kg CO₂e saved</p>
          </div>

          <div>
            <h3>24</h3>
            <p>activities logged</p>
          </div>

        </div>

      </section>


      {/* CTA */}

      <section className="cta-section">

        <h2>
          Ready to understand your impact?
        </h2>

        <p>
          Start tracking your carbon footprint today.
        </p>

        <button className="primary-button">
          Get Started
        </button>

      </section>


      {/* Footer */}

      <footer className="footer">

        <div className="footer-logo">
          Carbon<span>Wise</span>
        </div>

        <p>
          Track. Reduce. Sustain.
        </p>

        <p>
          © 2026 CarbonWise
        </p>

      </footer>

    </div>
  );
}

export default Landing;