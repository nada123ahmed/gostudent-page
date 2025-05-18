
import { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import './App.css';

function App() {
    const [formData, setFormData] = useState({
        loginPhone: '',
        contactPhone: '',
        email: '',
        name: '',
        address: '',
        addressNr: '',
        postalCode: '',
        city: '',
        country: '',
        sessions: '8',
        paymentMethod: 'card',
        cardHolder: '',
        cardNumber: '',
        cardExpiry: '',
        duration: '6 months',
        payInAdvance: false,
        language: 'en',
    });

    const [errors, setErrors] = useState({});
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [languageMenuOpen, setLanguageMenuOpen] = useState(false);

    const durationPrices = {
        '6 months': {
            8: { regularPrice: 29.40, yourPrice: 28.40, basePrice: 176.40 },
            12: { regularPrice: 44.10, yourPrice: 42.60, basePrice: 264.60 },
            16: { regularPrice: 58.80, yourPrice: 56.80, basePrice: 352.80 },
        },
        '9 months': {
            8: { regularPrice: 28.90, yourPrice: 27.90, basePrice: 251.10 },
            12: { regularPrice: 43.35, yourPrice: 41.85, basePrice: 376.65 },
            16: { regularPrice: 57.80, yourPrice: 55.80, basePrice: 502.20 },
        },
        '12 months': {
            8: { regularPrice: 28.40, yourPrice: 27.40, basePrice: 328.80 },
            12: { regularPrice: 42.60, yourPrice: 41.10, basePrice: 493.20 },
            16: { regularPrice: 56.80, yourPrice: 54.80, basePrice: 657.60 },
        },
        '18 months': {
            8: { regularPrice: 27.90, yourPrice: 26.90, basePrice: 484.20 },
            12: { regularPrice: 41.85, yourPrice: 40.35, basePrice: 726.30 },
            16: { regularPrice: 55.80, yourPrice: 53.80, basePrice: 968.40 },
        },
        '24 months': {
            8: { regularPrice: 27.40, yourPrice: 26.40, basePrice: 633.60 },
            12: { regularPrice: 41.10, yourPrice: 39.60, basePrice: 950.40 },
            16: { regularPrice: 54.80, yourPrice: 52.80, basePrice: 1267.20 },
        },
        '36 months': {
            8: { regularPrice: 26.90, yourPrice: 25.90, basePrice: 932.40 },
            12: { regularPrice: 40.35, yourPrice: 38.85, basePrice: 1398.60 },
            16: { regularPrice: 53.80, yourPrice: 51.80, basePrice: 1864.80 },
        },
    };

    const [pricing, setPricing] = useState(durationPrices['6 months'][8] || { regularPrice: 29.40, yourPrice: 28.40, basePrice: 176.40, discount: 0.60, setupFee: 0.00, total: 227.20 });

    const validateForm = () => {
        const newErrors = {};

        if (!formData.loginPhone) newErrors.loginPhone = 'Login phone number is required';
        if (!formData.contactPhone) newErrors.contactPhone = 'Contact phone number is required';
        if (!formData.email) newErrors.email = 'Email address is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        if (!formData.name) newErrors.name = 'Contact name is required';
        if (!formData.address) newErrors.address = 'Address is required';
        if (!formData.postalCode) newErrors.postalCode = 'Postal code is required';
        if (!formData.city) newErrors.city = 'City is required';
        if (!formData.country) newErrors.country = 'Country is required';
        if (formData.paymentMethod === 'card') {
            if (!formData.cardHolder) newErrors.cardHolder = 'Card holder name is required';
            if (!formData.cardNumber) newErrors.cardNumber = 'Card number is required';
            if (!formData.cardExpiry) newErrors.cardExpiry = 'Card expiry and CVC are required';
        }
        if (!formData.duration || !durationPrices[formData.duration]) newErrors.duration = 'Please select a valid duration';
        if (!termsAccepted) newErrors.terms = 'You must accept the Terms & Conditions';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'duration' || name === 'sessions') {
            const selectedDuration = name === 'duration' ? value : formData.duration;
            const selectedSessions = name === 'sessions' ? value : formData.sessions;
            const newPricingData = durationPrices[selectedDuration][selectedSessions] || durationPrices['6 months'][8];

            const countryDiscounts = {
                'Greece': 0.60,
                'UK': 0.60,
                'Egypt': 0.60,
                'default': 0.00,
            };
            const countryDiscount = countryDiscounts[formData.country] || countryDiscounts['default'];
            const advanceDiscount = formData.payInAdvance ? newPricingData.basePrice * 0.05 : 0;
            const totalDiscount = countryDiscount + advanceDiscount;
            const total = newPricingData.basePrice - totalDiscount;

            setPricing({
                ...newPricingData,
                discount: totalDiscount,
                total,
            });
        }
        setErrors({ ...errors, [name]: '' });
    };

    const handleTermsChange = (e) => {
        setTermsAccepted(e.target.checked);
        if (e.target.checked) {
            setErrors({ ...errors, terms: '' });
        }
    };

    const handlePayInAdvanceChange = (e) => {
        const isChecked = e.target.checked;
        setFormData({ ...formData, payInAdvance: isChecked });
        const newPricingData = durationPrices[formData.duration][formData.sessions] || durationPrices['6 months'][8];

        const countryDiscounts = {
            'Greece': 0.60,
            'UK': 0.60,
            'Egypt': 0.60,
            'default': 0.00,
        };
        const countryDiscount = countryDiscounts[formData.country] || countryDiscounts['default'];
        const advanceDiscount = isChecked ? newPricingData.basePrice * 0.05 : 0;
        const totalDiscount = countryDiscount + advanceDiscount;
        const total = newPricingData.basePrice - totalDiscount;
        setPricing({
            ...newPricingData,
            discount: totalDiscount,
            total,
        });
    };

    const handleCountryChange = (e) => {
        const country = e.target.value;
        setFormData({ ...formData, country });
        setErrors({ ...errors, country: '' });
        const newPricingData = durationPrices[formData.duration][formData.sessions] || durationPrices['6 months'][8];

        const countryDiscounts = {
            'Greece': 0.60,
            'UK': 0.60,
            'Egypt': 0.60,
            'default': 0.00,
        };

        const countryDiscount = countryDiscounts[country] || countryDiscounts['default'];
        const advanceDiscount = formData.payInAdvance ? newPricingData.basePrice * 0.05 : 0;
        const totalDiscount = countryDiscount + advanceDiscount;
        const total = newPricingData.basePrice - totalDiscount;
        setPricing({
            ...newPricingData,
            discount: totalDiscount,
            total,
        });
    };

    const handlePaymentMethodChange = (e) => {
        setFormData({ ...formData, paymentMethod: e.target.value });
    };

    const handleLanguageChange = (lang) => {
        setFormData({ ...formData, language: lang });
        setLanguageMenuOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                const data = await response.json();
                console.log('Server response:', data);
                alert('Order submitted successfully!');

                setFormData({
                    loginPhone: '',
                    contactPhone: '',
                    email: '',
                    name: '',
                    address: '',
                    addressNr: '',
                    postalCode: '',
                    city: '',
                    country: '',
                    sessions: '8',
                    paymentMethod: 'card',
                    cardHolder: '',
                    cardNumber: '',
                    cardExpiry: '',
                    duration: '6 months',
                    payInAdvance: false,
                    language: 'en',
                });
                setTermsAccepted(false);
                setPricing(durationPrices['6 months'][8]);
                setErrors({});
            } catch (error) {
                console.error('Error submitting order:', error);
                alert('There was an error submitting your order.');
            }
        }
    };

    const languageOptions = {
        'en': '/images/gb.png',
        'gr': '/images/gr.png',
        'fr': '/images/fr.png',
        'es': '/images/es.png',
        'eg': '/images/eg.webp',
    };

    const currentFlag = languageOptions[formData.language] || '/images/gb.png';

    return (
        <div className="main-container">
            <div className="language-selector" onClick={() => setLanguageMenuOpen(!languageMenuOpen)}>
                <span>All advantages</span> <img src={currentFlag} alt="Flag" className="flag-icon" />
                {languageMenuOpen && (
                    <div className="language-menu">
                        {Object.entries(languageOptions).map(([lang, flagUrl]) => (
                            <div
                                key={lang}
                                className="language-option"
                                onClick={() => handleLanguageChange(lang)}
                            >
                                <img src={flagUrl} alt={`${lang} flag`} className="flag-icon" /> {lang.toUpperCase()}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="form-overview-container">
                <div className="form-section">
                    <h2>Registration & Booking at GoStudent</h2>
                    <p>The leading platform for online tutoring.</p>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>LOGIN PHONE NUMBER (preferably the student's)</label>
                            <PhoneInput
                                country={'gr'}
                                value={formData.loginPhone}
                                onChange={(phone) => handleChange({ target: { name: 'loginPhone', value: phone } })}
                                inputProps={{
                                    name: 'loginPhone',
                                    required: true,
                                }}
                                containerClass="phone-input"
                            />
                            {errors.loginPhone && <p className="error-message">{errors.loginPhone}</p>}
                        </div>
                        <div className="form-group">
                            <label>CONTACT PHONE NUMBER (preferably the parent's)</label>
                            <PhoneInput
                                country={'gr'}
                                value={formData.contactPhone}
                                onChange={(phone) => handleChange({ target: { name: 'contactPhone', value: phone } })}
                                inputProps={{
                                    name: 'contactPhone',
                                    required: true,
                                }}
                                containerClass="phone-input"
                            />
                            {errors.contactPhone && <p className="error-message">{errors.contactPhone}</p>}
                        </div>
                        <div className="form-group">
                            <label>CONTACT EMAIL ADDRESS (preferably the parent's)</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            {errors.email && <p className="error-message">{errors.email}</p>}
                        </div>
                        <div className="form-group">
                            <label>CONTACT NAME</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                            {errors.name && <p className="error-message">{errors.name}</p>}
                        </div>
                        <div className="form-group">
                            <label className="section-title">BILLING ADDRESS</label>
                            <div className="address-group">
                                <div className="address-input">
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Address"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="addressNr"
                                        value={formData.addressNr}
                                        onChange={handleChange}
                                        placeholder="Nr"
                                        className="small-input"
                                    />
                                </div>
                                {errors.address && <p className="error-message">{errors.address}</p>}
                                <div className="address-row">
                                    <div className="address-field">
                                        <input
                                            type="text"
                                            name="postalCode"
                                            value={formData.postalCode}
                                            onChange={handleChange}
                                            placeholder="Postal code"
                                            required
                                        />
                                        {errors.postalCode && <p className="error-message">{errors.postalCode}</p>}
                                    </div>
                                    <div className="address-field">
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            placeholder="City"
                                            required
                                        />
                                        {errors.city && <p className="error-message">{errors.city}</p>}
                                    </div>
                                    <div className="address-field">
                                        <select
                                            name="country"
                                            value={formData.country}
                                            onChange={handleCountryChange}
                                            required
                                        >
                                            <option value="">Country</option>
                                            <option value="Greece">Greece</option>
                                            <option value="UK">United Kingdom</option>
                                            <option value="Egypt">Egypt</option>
                                        </select>
                                        {errors.country && <p className="error-message">{errors.country}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="section-title">MONTHLY SESSIONS</label>
                            <select
                                name="sessions"
                                value={formData.sessions}
                                onChange={handleChange}
                                required
                            >
                                <option value="8">8 Sessions</option>
                                <option value="12">12 Sessions</option>
                                <option value="16">16 Sessions</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="section-title">SELECT PAYMENT METHOD</label>
                            <div className="payment-options">
                                <div className={`payment-method ${formData.paymentMethod === 'stonlear' ? 'active' : ''}`}>
                                    <label>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="stonlear"
                                            checked={formData.paymentMethod === 'stonlear'}
                                            onChange={handlePaymentMethodChange}
                                        />
                                        <img
                                            src="/images/sepa-logo-png_seeklogo-440172.png"
                                            alt="SEPA"
                                            className="sepa-logo"
                                        />
                                    </label>
                                </div>
                                <div className={`payment-method ${formData.paymentMethod === 'card' ? 'active' : ''}`}>
                                    <label>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="card"
                                            checked={formData.paymentMethod === 'card'}
                                            onChange={handlePaymentMethodChange}
                                        />
                                        <div className="payment-methods">
                                            <img src="/images/Visa_Inc._logo.svg" alt="Visa" className="card-logo" />
                                            <img src="/images/Mastercard-logo.svg" alt="Mastercard" className="card-logo" />
                                            <img src="/images/Mastercard-logo.svg" alt="Mastercard" className="card-logo" />
                                        </div>
                                    </label>
                                </div>
                            </div>
                            <p className="secure-note">100% secure payment. All data is encrypted.</p>
                            {formData.paymentMethod === 'card' && (
                                <>
                                    <input
                                        type="text"
                                        name="cardHolder"
                                        value={formData.cardHolder}
                                        onChange={handleChange}
                                        placeholder="Card holder"
                                        required
                                        className="input-full"
                                    />
                                    {errors.cardHolder && <p className="error-message">{errors.cardHolder}</p>}
                                    <div className="card-details">
                                        <input
                                            type="text"
                                            name="cardNumber"
                                            value={formData.cardNumber}
                                            onChange={handleChange}
                                            placeholder="Card number"
                                            required
                                            className="card-number-input"
                                        />
                                        <input
                                            type="text"
                                            name="cardExpiry"
                                            value={formData.cardExpiry}
                                            onChange={handleChange}
                                            placeholder="MM / YY CVC"
                                            required
                                            className="card-expiry-input"
                                        />
                                    </div>
                                    {errors.cardNumber && <p className="error-message">{errors.cardNumber}</p>}
                                    {errors.cardExpiry && <p className="error-message">{errors.cardExpiry}</p>}
                                </>
                            )}
                        </div>
                    </form>
                </div>
                <div className="overview-section">
                    <h2>Order Overview</h2>
                    <div className="overview-grid">
                        <label className={`overview-item ${formData.duration === '6 months' ? 'selected' : ''}`}>
                            <input
                                type="radio"
                                name="duration"
                                value="6 months"
                                checked={formData.duration === '6 months'}
                                onChange={handleChange}
                            />
                            6 months
                        </label>
                        <label className={`overview-item ${formData.duration === '9 months' ? 'selected' : ''}`}>
                            <input
                                type="radio"
                                name="duration"
                                value="9 months"
                                checked={formData.duration === '9 months'}
                                onChange={handleChange}
                            />
                            9 months
                        </label>
                        <label className={`overview-item ${formData.duration === '12 months' ? 'selected' : ''}`}>
                            <input
                                type="radio"
                                name="duration"
                                value="12 months"
                                checked={formData.duration === '12 months'}
                                onChange={handleChange}
                            />
                            12 months
                        </label>
                        <label className={`overview-item ${formData.duration === '18 months' ? 'selected' : ''}`}>
                            <input
                                type="radio"
                                name="duration"
                                value="18 months"
                                checked={formData.duration === '18 months'}
                                onChange={handleChange}
                            />
                            18 months
                        </label>
                        <label className={`overview-item ${formData.duration === '24 months' ? 'selected' : ''}`}>
                            <input
                                type="radio"
                                name="duration"
                                value="24 months"
                                checked={formData.duration === '24 months'}
                                onChange={handleChange}
                            />
                            24 months
                        </label>
                        <label className={`overview-item ${formData.duration === '36 months' ? 'selected' : ''}`}>
                            <input
                                type="radio"
                                name="duration"
                                value="36 months"
                                checked={formData.duration === '36 months'}
                                onChange={handleChange}
                            />
                            36 months
                        </label>
                    </div>
                    {errors.duration && <p className="error-message">{errors.duration}</p>}
                    <div className="discount-note">
                        <span>Pay in advance • EXTRA 5% DISCOUNT</span>
                        <label className="switch">
                            <input
                                type="checkbox"
                                name="payInAdvance"
                                checked={formData.payInAdvance}
                                onChange={handlePayInAdvanceChange}
                            />
                            <span className="slider round"></span>
                        </label>
                    </div>
                    <p className='num-price'>Number of sessions p.m.: <span>{formData.sessions}</span></p>
                    <p className='reg-price'>Regular Price: <span className="strikethrough">{(pricing.regularPrice || 29.40).toFixed(2)}€</span></p>
                    <p className='ur-price'>Your Price: <span>{(pricing.yourPrice || 28.40).toFixed(2)}€</span></p>
                    <p className="discount">Discount 4%: <span>{(pricing.discount - (formData.payInAdvance ? (pricing.basePrice * 0.05) : 0)).toFixed(2)}€</span></p>
                    {formData.payInAdvance && <p className="discount">Extra 5% Discount: <span>{((pricing.basePrice || 176.40) * 0.05).toFixed(2)}€</span></p>}
                    <p className='setup-p'>Setup Fee: <span className='setup-span'>{(pricing.setupFee || 0.00).toFixed(2)}€</span></p>
                    <p className="total">Total p.m.: <span>{(pricing.total || 227.20).toFixed(2)}€</span></p>
                    <p className="terms">
                        <input
                            type="checkbox"
                            id="terms"
                            checked={termsAccepted}
                            onChange={handleTermsChange}
                        />
                        I accept the Terms & Conditions and understand my right of withdrawal as well as the effects that lead to a repeal of the same.
                    </p>
                    {errors.terms && <p className="error-message">{errors.terms}</p>}
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="submit-button"
                        disabled={!termsAccepted}
                    >
                        Order Now
                    </button>
                    <p className="footer-text">95% SATISFACTION RATE!</p>
                </div>
            </div>
        </div>
    );
}

export default App;