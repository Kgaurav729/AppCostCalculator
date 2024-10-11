// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './App.css'; // Import custom CSS for background gradient

const App = () => {
    const [categories, setCategories] = useState([]);
    const [features, setFeatures] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedFeatures, setSelectedFeatures] = useState({});
    const [totalCost, setTotalCost] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        // Fetch app categories from the backend
        axios.get('https://appcostcalculator.onrender.com/api/categories/')
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.error("Error fetching categories:", error);
            });
    }, []);

    const handleCategoryChange = (e) => {
        const categoryId = e.target.value;
        setSelectedCategory(categoryId);

        // Reset selected features when category changes
        setSelectedFeatures({});
        setFeatures([]); // Reset features
        setTotalCost(0); // Reset total cost

        // Fetch features for the selected category
        axios.get(`https://appcostcalculator.onrender.com/api/features/?category_id=${categoryId}`)
            .then(response => {
                setFeatures(response.data);
            })
            .catch(error => {
                console.error("Error fetching features:", error);
            });
    };

    const handleFeatureChange = (e) => {
        const featureId = e.target.value;
        const featureHours = parseInt(e.target.dataset.hours); // Get hours for the feature
        const updatedSelectedFeatures = { ...selectedFeatures };

        // Toggle feature selection
        if (updatedSelectedFeatures[featureId]) {
            delete updatedSelectedFeatures[featureId];
        } else {
            updatedSelectedFeatures[featureId] = featureHours;
        }

        setSelectedFeatures(updatedSelectedFeatures);
    };

    const calculateCost = () => {
        // Validate selection of category and at least one feature
        if (!selectedCategory || Object.keys(selectedFeatures).length === 0) {
            setErrorMessage("Please select an app category and at least one feature.");
            return;
        } else {
            setErrorMessage('');
        }

        // Sum the total hours of selected features
        const totalHours = Object.values(selectedFeatures).reduce((sum, hours) => sum + hours, 0);
        const totalCost = totalHours * 10; // Assuming $10/hour rate
        setTotalCost(totalCost);
    };

    const resetForm = () => {
        // Reset all selections and cost
        setSelectedCategory('');
        setSelectedFeatures({});
        setFeatures([]);
        setTotalCost(0);
        setErrorMessage('');
    };

    return (
        <div className="container-fluid vh-100 d-flex justify-content-center align-items-center gradient-bg">
            <div className="card p-4 shadow"  style={{ width: '100%', maxWidth: '600px' } }>
                <h1 className="text-center mb-4">App Cost Calculator</h1>
                
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                <div className="form-group mb-4">
                    <label htmlFor="category" className="font-weight-bold h5">App Category</label>
                    <select 
                        id="category" 
                        className="form-control mt-2" 
                        value={selectedCategory} 
                        onChange={handleCategoryChange}>
                        <option value="">Select a category</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group mb-4">
                    <label className="font-weight-bold h5">App Features</label>
                    {features.length > 0 ? (
                        features.map(feature => (
                            <div key={feature.id} className="form-check text-left">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    value={feature.id}
                                    data-hours={feature.hours} // Store the hours for each feature
                                    onChange={handleFeatureChange}
                                    checked={!!selectedFeatures[feature.id]} // Persist checkbox state
                                />
                                <label className="form-check-label">
                                    {feature.name} - {feature.hours} hours
                                </label>
                            </div>
                        ))
                    ) : (
                        <p className="text-muted">Please select a category to see features</p>
                    )}
                </div>

                <div className="d-flex justify-content-between mb-4">
                    <button className="btn btn-primary" onClick={calculateCost}>
                        Calculate Cost
                    </button>
                    <button className="btn btn-outline-secondary" onClick={resetForm}>
                        Reset
                    </button>
                </div>

                <h3 className="text-center">Total Cost: ${totalCost}</h3>
            </div>
        </div>
    );
};

export default App;




