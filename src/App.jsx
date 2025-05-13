

import { useState } from 'react';
import './App.css';

function App() {
    const [formData, setFormData] = useState({
        loginPhone: '',
        loginPhonePrefix: '+30',
        contactPhone: '',
        contactPhonePrefix: '+30',
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
        '6 months': { regularPrice: 29.40, yourPrice: 28.40, basePrice: 176.40 },
        '9 months': { regularPrice: 28.90, yourPrice: 27.90, basePrice: 251.10 },
        '12 months': { regularPrice: 28.40, yourPrice: 27.40, basePrice: 328.80 },
        '18 months': { regularPrice: 27.90, yourPrice: 26.90, basePrice: 484.20 },
        '24 months': { regularPrice: 27.40, yourPrice: 26.40, basePrice: 633.60 },
        '36 months': { regularPrice: 26.90, yourPrice: 25.90, basePrice: 932.40 },
    };

    const [pricing, setPricing] = useState(durationPrices['6 months'] || { regularPrice: 29.40, yourPrice: 28.40, basePrice: 176.40, discount: 0.60, setupFee: 0.00, total: 227.20 });

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

        if (name === 'duration') {
            const newPricingData = durationPrices[value] || durationPrices['6 months'];
            const countryDiscount = formData.country === 'Greece' ? 0.60 : 0.00;
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

        const countryDiscount = formData.country === 'Greece' ? 0.60 : 0.00;
        const advanceDiscount = isChecked ? (pricing.basePrice || 176.40) * 0.05 : 0;
        const totalDiscount = countryDiscount + advanceDiscount;
        const total = (pricing.basePrice || 176.40) - totalDiscount;

        setPricing({
            ...pricing,
            discount: totalDiscount,
            total,
        });
    };

    const handleCountryChange = (e) => {
        const country = e.target.value;
        setFormData({ ...formData, country });
        setErrors({ ...errors, country: '' });

        const countryDiscount = country === 'Greece' ? 0.60 : 0.00;
        const advanceDiscount = formData.payInAdvance ? (pricing.basePrice || 176.40) * 0.05 : 0;
        const totalDiscount = countryDiscount + advanceDiscount;
        const total = (pricing.basePrice || 176.40) - totalDiscount;

        setPricing({
            ...pricing,
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
                    loginPhonePrefix: '+30',
                    contactPhone: '',
                    contactPhonePrefix: '+30',
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
                setPricing(durationPrices['6 months']);
                setErrors({});
            } catch (error) {
                console.error('Error submitting order:', error);
                alert('There was an error submitting your order.');
            }
        }
    };

    const languageOptions = {
        'en': '../public/images/gb.png',
        'gr': '../public/images/gr.png',
        'fr': '../public/images/fr.png',
        'es': '../public/images/es.png',
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
                            <div className="phone-input">
                                <select name="loginPhonePrefix" value={formData.loginPhonePrefix} onChange={handleChange}>
                                    <option value="+30">+30</option>
                                    <option value="+44">+44</option>
                                </select>
                                <input
                                    type="tel"
                                    name="loginPhone"
                                    value={formData.loginPhone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            {errors.loginPhone && <p className="error-message">{errors.loginPhone}</p>}
                        </div>
                        <div className="form-group">
                            <label>CONTACT PHONE NUMBER (preferably the parent's)</label>
                            <div className="phone-input">
                                <select name="contactPhonePrefix" value={formData.contactPhonePrefix} onChange={handleChange}>
                                    <option value="+30">+30</option>
                                    <option value="+44">+44</option>
                                </select>
                                <input
                                    type="tel"
                                    name="contactPhone"
                                    value={formData.contactPhone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
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
                    <p className='num-price'>Number of sessions p.m.: <span>8</span></p>
                    <p className='reg-price'>Regular Price: <span className="strikethrough">{(pricing.regularPrice || 29.40).toFixed(2)}€</span></p>
                    <p className='ur-price'>Your Price: <span>{(pricing.yourPrice || 28.40).toFixed(2)}€</span></p>
                    <p className="discount">Discount 4%: <span>{Math.abs(formData.country === 'Greece' ? 0.60 : 0.00).toFixed(2)}€</span></p>
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