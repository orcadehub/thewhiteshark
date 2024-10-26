import React, { useState, useEffect } from "react";
// import "./Login.css";

function Login() {
  const [countryCode, setCountryCode] = useState("us");
  const [flagUrl, setFlagUrl] = useState("https://flagcdn.com/w320/us.png");

  useEffect(() => {
    // Update the flag URL when the country code changes
    setFlagUrl(`https://flagcdn.com/w320/${countryCode}.png`);
  }, [countryCode]);

  const handleLoginRedirect = (url) => {
    window.location.href = url;
  };

  return (
    <div className="container">
      <h1>Enter your mobile number</h1>
      <div className="input-group p-2">
        <img src={flagUrl} className="flag" alt="Country Flag" />
        <select
          className="country-code"
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
        >
          <option value="us" data-country-code="1">
            🇺🇸 +1 (US)
          </option>
          <option value="ca" data-country-code="1">
            🇨🇦 +1 (Canada)
          </option>
          <option value="gb" data-country-code="44">
            🇬🇧 +44 (UK)
          </option>
          <option value="in" data-country-code="91">
            🇮🇳 +91 (India)
          </option>
          <option value="au" data-country-code="61">
            🇦🇺 +61 (Australia)
          </option>
          <option value="fr" data-country-code="33">
            🇫🇷 +33 (France)
          </option>
          <option value="de" data-country-code="49">
            🇩🇪 +49 (Germany)
          </option>
          <option value="br" data-country-code="55">
            🇧🇷 +55 (Brazil)
          </option>
          <option value="jp" data-country-code="81">
            🇯🇵 +81 (Japan)
          </option>
          <option value="cn" data-country-code="86">
            🇨🇳 +86 (China)
          </option>
          <option value="ru" data-country-code="7">
            🇷🇺 +7 (Russia)
          </option>
          <option value="mx" data-country-code="52">
            🇲🇽 +52 (Mexico)
          </option>
          <option value="za" data-country-code="27">
            🇿🇦 +27 (South Africa)
          </option>
          <option value="kr" data-country-code="82">
            🇰🇷 +82 (South Korea)
          </option>
        </select>
        <input
          type="tel"
          className="mobile-number"
          placeholder="Enter mobile number"
          required
        />
      </div>
      <button className="continue-button">Continue</button>
      <div className="or-divider">or</div>
      <div className="social-buttons">
        <button
          className="social-button google"
          onClick={() =>
            handleLoginRedirect("https://accounts.google.com/signin")
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="currentColor"
            className="bi bi-google"
            viewBox="0 0 16 16"
            style={{ paddingRight: "12px" }}
          >
            <path d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z" />
          </svg>
          Continue with Google
        </button>

        <button
          className="social-button apple"
          onClick={() =>
            handleLoginRedirect("https://appleid.apple.com/auth/signin")
          }
          style={{ paddingRight: "30px" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="33px"
            height="33px"
            fill="white"
            className="apple-icon"
            style={{ paddingRight: "10px" }}
          >
            <path d="M17.64,12.09c-0.02-2.59,2.11-3.83,2.2-3.88c-1.2-1.75-3.06-1.99-3.71-2.02c-1.57-0.16-3.05,0.91-3.84,0.91c-0.78,0-1.98-0.88-3.25-0.86c-1.68,0.03-3.24,0.98-4.12,2.49c-1.74,3.01-0.44,7.46,1.24,9.9c0.82,1.18,1.8,2.5,3.09,2.45c1.25-0.05,1.73-0.79,3.25-0.79c1.51,0,1.94,0.79,3.26,0.76c1.34-0.02,2.19-1.19,3-2.39c0.95-1.4,1.34-2.76,1.36-2.84C19.79,16.36,17.66,15.55,17.64,12.09z M15.26,5.36c0.69-0.84,1.16-2.02,1.03-3.19c-0.99,0.04-2.19,0.66-2.89,1.5c-0.64,0.75-1.2,1.95-1.05,3.11C13.52,6.88,14.63,6.25,15.26,5.36z" />
          </svg>
          Continue with Apple
        </button>

        <button
          className="social-button facebook"
          onClick={() =>
            handleLoginRedirect("https://www.facebook.com/login.php")
          }
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
            alt="Facebook Icon"
          />
          Continue with Facebook
        </button>
      </div>
    </div>
  );
}
export default Login;
