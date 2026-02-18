"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { instrumentService } from '@/services/instrumentService';
import InstrumentGrid from '@/components/CIF/InstrumentGrid';
import InstrumentDetails from '@/components/CIF/InstrumentDetails';
import ChargesModal from '@/components/CIF/ChargesModal';
import FaqSection from '@/components/CIF/FaqSection';
import styles from '@/styles/Instruments.module.css';
import FacilitiesSection from '@/components/CIF/FacilitiesSection';
import { Link } from 'lucide-react';
import AboutSection from '@/components/CIF/AboutSection';

function InstrumentsContent() {

  const AllSpecifications =  [
        {
            "id": 1,
            "categoryId": 1,
            "keyName": "SEI resolution",
            "keyValue": "1.0nm (15kV) , 1.3nm (1kV) , During analysis 3.0 nm (15 kV? probe current 5 nA)",
            "specificationType": null
        },
        {
            "id": 2,
            "categoryId": 1,
            "keyName": "Magnification",
            "keyValue": "25 to 1,000,000",
            "specificationType": null
        },
        {
            "id": 3,
            "categoryId": 1,
            "keyName": "Accelerating voltage",
            "keyValue": "0.1kV to 30kV",
            "specificationType": null
        },
        {
            "id": 4,
            "categoryId": 1,
            "keyName": "Probe current",
            "keyValue": "A few pA  to 200nA",
            "specificationType": null
        },
        {
            "id": 5,
            "categoryId": 1,
            "keyName": "Detectors",
            "keyValue": "Secondary Electron, Back Scattered Electron",
            "specificationType": null
        },
        {
            "id": 6,
            "categoryId": 1,
            "keyName": "Specimen stage",
            "keyValue": "Eucentric, 5 axes motor control",
            "specificationType": null
        },
        {
            "id": 7,
            "categoryId": 1,
            "keyName": "X-Y",
            "keyValue": "70mm×50mm",
            "specificationType": null
        },
        {
            "id": 8,
            "categoryId": 1,
            "keyName": "Tilt",
            "keyValue": "-5° to ~+70°",
            "specificationType": null
        },
        {
            "id": 9,
            "categoryId": 1,
            "keyName": "Rotation",
            "keyValue": "360°endless",
            "specificationType": null
        },
        {
            "id": 10,
            "categoryId": 1,
            "keyName": "WD",
            "keyValue": "1.0mm to 40mm",
            "specificationType": null
        },
        {
            "id": 11,
            "categoryId": 3,
            "keyName": "Make",
            "keyValue": "Perkin Elmer",
            "specificationType": null
        },
        {
            "id": 12,
            "categoryId": 3,
            "keyName": "Optics",
            "keyValue": "KBr",
            "specificationType": null
        },
        {
            "id": 13,
            "categoryId": 3,
            "keyName": "Sensitivity",
            "keyValue": "32,000:1 peak to peak for 1minute scan",
            "specificationType": null
        },
        {
            "id": 14,
            "categoryId": 3,
            "keyName": "Resolution",
            "keyValue": "0.5 cm-1",
            "specificationType": null
        },
        {
            "id": 15,
            "categoryId": 3,
            "keyName": "Scan range",
            "keyValue": "8,300-350 cm-1 whilst offering 0.5cm-1 resolution and 32,000:1",
            "specificationType": null
        },
        {
            "id": 16,
            "categoryId": 3,
            "keyName": "ATR accessory",
            "keyValue": "Diamond",
            "specificationType": null
        },
        {
            "id": 17,
            "categoryId": 3,
            "keyName": "Software",
            "keyValue": "Spectrum 10 software",
            "specificationType": null
        },
        {
            "id": 18,
            "categoryId": 4,
            "keyName": "Make",
            "keyValue": "Perkin Elmer",
            "specificationType": null
        },
        {
            "id": 19,
            "categoryId": 4,
            "keyName": "Lamp",
            "keyValue": "Pulse Xenon lamp with user defined Power Settings for fluorescence and phosphorescence",
            "specificationType": null
        },
        {
            "id": 20,
            "categoryId": 4,
            "keyName": "Power setting",
            "keyValue": "4 Peak Power settings 120 Kw, 80 Kw, 40 Kw, 20 Kw",
            "specificationType": null
        },
        {
            "id": 21,
            "categoryId": 4,
            "keyName": "Excitation",
            "keyValue": "200–900 nm with zero order selectable",
            "specificationType": null
        },
        {
            "id": 22,
            "categoryId": 4,
            "keyName": "Emission",
            "keyValue": "200–900 nm with zero order selectable",
            "specificationType": null
        },
        {
            "id": 23,
            "categoryId": 4,
            "keyName": "Slit width",
            "keyValue": "Variable slit width of 1, 2.5, 5, 10, 20 nm nm to 20 nm",
            "specificationType": null
        },
        {
            "id": 24,
            "categoryId": 4,
            "keyName": "Filter wheel (Emission monochromator)",
            "keyValue": "Software-controlled filter wheel with 320, 430, 515 nm nm cutoff filters",
            "specificationType": null
        },
        {
            "id": 25,
            "categoryId": 4,
            "keyName": "Filter wheel (Excitation monochromator)",
            "keyValue": "Software-controlled filter wheel with 290, 350, 530 nm nm cutoff filters",
            "specificationType": null
        },
        {
            "id": 26,
            "categoryId": 5,
            "keyName": "Make",
            "keyValue": "Perkin Elmer",
            "specificationType": null
        },
        {
            "id": 27,
            "categoryId": 5,
            "keyName": "Temperature range",
            "keyValue": "15°C to 1000°C",
            "specificationType": null
        },
        {
            "id": 28,
            "categoryId": 5,
            "keyName": "Scanning rates",
            "keyValue": "0.1 to 200°C/min",
            "specificationType": null
        },
        {
            "id": 29,
            "categoryId": 5,
            "keyName": "Temperature precision",
            "keyValue": "±0.8°C",
            "specificationType": null
        },
        {
            "id": 30,
            "categoryId": 5,
            "keyName": "Balance measurement range",
            "keyValue": "1500 mg",
            "specificationType": null
        },
        {
            "id": 31,
            "categoryId": 5,
            "keyName": "Balance Accuracy",
            "keyValue": "Better than 0.2% of total sample and pan",
            "specificationType": null
        },
        {
            "id": 32,
            "categoryId": 5,
            "keyName": "Cooling times",
            "keyValue": "1000 to 100°C in less than 8 minutes and 1000 to 30°C in under 15 minutes",
            "specificationType": null
        },
        {
            "id": 33,
            "categoryId": 6,
            "keyName": "Make",
            "keyValue": "Perkin Elmer",
            "specificationType": null
        },
        {
            "id": 34,
            "categoryId": 6,
            "keyName": "Temperature range",
            "keyValue": "-70 °C to +450°C",
            "specificationType": null
        },
        {
            "id": 35,
            "categoryId": 6,
            "keyName": "Rate of increase of temperature",
            "keyValue": "0.01° C/min to 100° C/min",
            "specificationType": null
        },
        {
            "id": 36,
            "categoryId": 6,
            "keyName": "Sample plate",
            "keyValue": "Nickel-Chromium sample plate",
            "specificationType": null
        },
        {
            "id": 37,
            "categoryId": 6,
            "keyName": "Design",
            "keyValue": "Single furnace design",
            "specificationType": null
        },
        {
            "id": 38,
            "categoryId": 6,
            "keyName": "Furnace",
            "keyValue": "Alumina coated aluminum furnace",
            "specificationType": null
        },
        {
            "id": 39,
            "categoryId": 6,
            "keyName": "Gas used to achieve inert-atmosphere",
            "keyValue": "99.999% Nitrogen gas",
            "specificationType": null
        },
        {
            "id": 40,
            "categoryId": 6,
            "keyName": "Sensor",
            "keyValue": "Thermocouple based temperature sensors",
            "specificationType": null
        },
        {
            "id": 41,
            "categoryId": 7,
            "keyName": "Mass Range",
            "keyValue": "2 m/z to 1,090 m/z ",
            "specificationType": null
        },
        {
            "id": 42,
            "categoryId": 7,
            "keyName": "Maximum Scan rate",
            "keyValue": "20,000 amu /sec",
            "specificationType": null
        },
        {
            "id": 43,
            "categoryId": 7,
            "keyName": "Ionization technique",
            "keyValue": "Electron Impact Ionization (EI)",
            "specificationType": null
        },
        {
            "id": 44,
            "categoryId": 7,
            "keyName": "Software",
            "keyValue": "GCMSsolution™ software",
            "specificationType": null
        },
        {
            "id": 45,
            "categoryId": 7,
            "keyName": "Data base",
            "keyValue": "APAWLY-9781119376743 NIST Mass Spectral Library 2017",
            "specificationType": null
        },
        {
            "id": 46,
            "categoryId": 7,
            "keyName": "Flame Ionization Detector",
            "keyValue": "FID-2030, 230V",
            "specificationType": null
        },
        {
            "id": 47,
            "categoryId": 7,
            "keyName": "Q1 & Q3 Analyzers",
            "keyValue": "Rock Solid Inert Metal Quadrupole Analyzer with rotatable pre-rods",
            "specificationType": null
        },
        {
            "id": 48,
            "categoryId": 7,
            "keyName": "Unique Direct Inlet Probe for Solid and Liquids",
            "keyValue": "DI-2010 Direct Inlet System",
            "specificationType": null
        },
        {
            "id": 49,
            "categoryId": 9,
            "keyName": "Electrode connections",
            "keyValue": "2, 3 and 4",
            "specificationType": null
        },
        {
            "id": 50,
            "categoryId": 9,
            "keyName": "Potential range",
            "keyValue": "+/- 10 V",
            "specificationType": null
        },
        {
            "id": 51,
            "categoryId": 9,
            "keyName": "Compliance voltage",
            "keyValue": "+/- 20 V",
            "specificationType": null
        },
        {
            "id": 52,
            "categoryId": 9,
            "keyName": "Maximum current",
            "keyValue": "+/- 400 mA",
            "specificationType": null
        },
        {
            "id": 53,
            "categoryId": 9,
            "keyName": "Current ranges",
            "keyValue": "10 nA to 100 mA ",
            "specificationType": null
        },
        {
            "id": 54,
            "categoryId": 9,
            "keyName": "Potential accuracy",
            "keyValue": "+/- 0.2 %",
            "specificationType": null
        },
        {
            "id": 55,
            "categoryId": 9,
            "keyName": "Potential resolution",
            "keyValue": "3 µV",
            "specificationType": null
        },
        {
            "id": 56,
            "categoryId": 9,
            "keyName": "Current accuracy",
            "keyValue": "+/- 0.2 %",
            "specificationType": null
        },
        {
            "id": 57,
            "categoryId": 9,
            "keyName": "Current resolution",
            "keyValue": "0.0003 % (of current range)",
            "specificationType": null
        },
        {
            "id": 58,
            "categoryId": 9,
            "keyName": "Input impedance",
            "keyValue": "> 100 GOhm",
            "specificationType": null
        },
        {
            "id": 59,
            "categoryId": 9,
            "keyName": "Potentiostat bandwidth",
            "keyValue": "1 MHz",
            "specificationType": null
        },
        {
            "id": 60,
            "categoryId": 9,
            "keyName": "Computer interface",
            "keyValue": "USB",
            "specificationType": null
        },
        {
            "id": 61,
            "categoryId": 9,
            "keyName": "Control software",
            "keyValue": "NOVA",
            "specificationType": null
        },
        {
            "id": 62,
            "categoryId": 9,
            "keyName": "Frequency range",
            "keyValue": "10 µHz - 32 MHz (10 µHz - 1 MHz in combination with the Autolab PGSTAT)",
            "specificationType": null
        },
        {
            "id": 63,
            "categoryId": 9,
            "keyName": "Frequency resolution",
            "keyValue": "0.003 %",
            "specificationType": null
        },
        {
            "id": 64,
            "categoryId": 9,
            "keyName": "Input range",
            "keyValue": "10 V",
            "specificationType": null
        },
        {
            "id": 65,
            "categoryId": 9,
            "keyName": "Signal types",
            "keyValue": " 1 sine, 5 sine, 15 sine",
            "specificationType": null
        },
        {
            "id": 66,
            "categoryId": 9,
            "keyName": "AC amplitude",
            "keyValue": "0.2 mV to 0.35 V rms in potentiostatic mode",
            "specificationType": null
        },
        {
            "id": 67,
            "categoryId": 9,
            "keyName": "",
            "keyValue": "0.0002 - 0.35 times current range in galvanostatic mode",
            "specificationType": null
        },
        {
            "id": 68,
            "categoryId": 9,
            "keyName": "Data presentation",
            "keyValue": "Nyquist, Bode, Admittance, Dielectric, Mott-Schottky and more",
            "specificationType": null
        },
        {
            "id": 69,
            "categoryId": 9,
            "keyName": "Data analysis",
            "keyValue": "Fit and Simulation, Find circle",
            "specificationType": null
        },
        {
            "id": 70,
            "categoryId": 9,
            "keyName": "Graphical Equivalent Circuit",
            "keyValue": "NOVA Software",
            "specificationType": null
        },
        {
            "id": 71,
            "categoryId": 10,
            "keyName": "Capacity (Max)",
            "keyValue": "220 g",
            "specificationType": null
        },
        {
            "id": 72,
            "categoryId": 10,
            "keyName": "Readability (d)",
            "keyValue": "0.0001 g",
            "specificationType": null
        },
        {
            "id": 73,
            "categoryId": 10,
            "keyName": "Repeatability (±)",
            "keyValue": "0.2 mg",
            "specificationType": null
        },
        {
            "id": 74,
            "categoryId": 10,
            "keyName": "Linearity (±)",
            "keyValue": "0.4 mg",
            "specificationType": null
        },
        {
            "id": 75,
            "categoryId": 10,
            "keyName": "Capacity (Min)",
            "keyValue": "10 mg",
            "specificationType": null
        },
        {
            "id": 76,
            "categoryId": 10,
            "keyName": "Verification scale intervals (e)",
            "keyValue": "1 mg",
            "specificationType": null
        },
        {
            "id": 77,
            "categoryId": 10,
            "keyName": "Response time",
            "keyValue": "< 5 Sec",
            "specificationType": null
        },
        {
            "id": 78,
            "categoryId": 10,
            "keyName": "Operating temperature",
            "keyValue": "± 15 °C to ± 25 °C",
            "specificationType": null
        },
        {
            "id": 79,
            "categoryId": 10,
            "keyName": "Sensitivity Drift (±)",
            "keyValue": "2 ppm/°C",
            "specificationType": null
        },
        {
            "id": 80,
            "categoryId": 10,
            "keyName": "Pen size",
            "keyValue": "80 mm",
            "specificationType": null
        },
        {
            "id": 81,
            "categoryId": 11,
            "keyName": "Maximum Rotational Speed of Centrifuge",
            "keyValue": "14,000 min-1",
            "specificationType": null
        },
        {
            "id": 82,
            "categoryId": 11,
            "keyName": "Maximum Centrifugal Force of Centrifuge",
            "keyValue": "20,800 x g",
            "specificationType": null
        },
        {
            "id": 83,
            "categoryId": 11,
            "keyName": "Maximum Rotational speed of Rotor A-4-44",
            "keyValue": "5,000 rpm",
            "specificationType": null
        },
        {
            "id": 84,
            "categoryId": 11,
            "keyName": "Maximum Centrifugal Force of Rotor A-4-44",
            "keyValue": "4,500 x g",
            "specificationType": null
        },
        {
            "id": 85,
            "categoryId": 11,
            "keyName": "Cooling",
            "keyValue": "Refrigerated",
            "specificationType": null
        },
        {
            "id": 86,
            "categoryId": 11,
            "keyName": "Temperature Range",
            "keyValue": "-9 °C to +40 °C",
            "specificationType": null
        },
        {
            "id": 87,
            "categoryId": 11,
            "keyName": "Sample temperature",
            "keyValue": "< 4 °C at maximum speed",
            "specificationType": null
        },
        {
            "id": 88,
            "categoryId": 11,
            "keyName": "Speed",
            "keyValue": "200–14,000 rpm",
            "specificationType": null
        },
        {
            "id": 89,
            "categoryId": 11,
            "keyName": "Max. capacity",
            "keyValue": "4 × 250 mL/2 × 5 MTP",
            "specificationType": null
        },
        {
            "id": 90,
            "categoryId": 11,
            "keyName": "Acceleration/braking ramps",
            "keyValue": "10/10",
            "specificationType": null
        },
        {
            "id": 91,
            "categoryId": 11,
            "keyName": "Number of programs",
            "keyValue": "35 user-defined programs",
            "specificationType": null
        },
        {
            "id": 92,
            "categoryId": 11,
            "keyName": "Timer",
            "keyValue": "1 min to 99 min, with continuous run function, short-spin",
            "specificationType": null
        },
        {
            "id": 93,
            "categoryId": 11,
            "keyName": "Control software",
            "keyValue": "NOVA",
            "specificationType": null
        },
        {
            "id": 94,
            "categoryId": 12,
            "keyName": "Measuring Range mPa.s",
            "keyValue": "20-6,000,000",
            "specificationType": null
        },
        {
            "id": 95,
            "categoryId": 12,
            "keyName": "Speed",
            "keyValue": "0.1 to 200",
            "specificationType": null
        },
        {
            "id": 96,
            "categoryId": 12,
            "keyName": "No of Speed",
            "keyValue": "54",
            "specificationType": null
        },
        {
            "id": 97,
            "categoryId": 12,
            "keyName": "No of Standard Spindle",
            "keyValue": "4",
            "specificationType": null
        },
        {
            "id": 98,
            "categoryId": 12,
            "keyName": "Measurement Accuracy",
            "keyValue": "+ / - 1% (FS)",
            "specificationType": null
        },
        {
            "id": 99,
            "categoryId": 12,
            "keyName": "Repeatability",
            "keyValue": "+ / - 0.5 % (FS)",
            "specificationType": null
        },
        {
            "id": 100,
            "categoryId": 12,
            "keyName": "Output",
            "keyValue": "RS232 Interface",
            "specificationType": null
        },
        {
            "id": 101,
            "categoryId": 14,
            "keyName": "Stray Light",
            "keyValue": "<0.02%T at 340 nm, 400 nm; <1.0%T at 198 nm",
            "specificationType": null
        },
        {
            "id": 102,
            "categoryId": 14,
            "keyName": "Source Lamp\t",
            "keyValue": "Deuterium; Tungsten-Halogen",
            "specificationType": null
        },
        {
            "id": 103,
            "categoryId": 14,
            "keyName": "Beam Type",
            "keyValue": "Double",
            "specificationType": null
        },
        {
            "id": 104,
            "categoryId": 14,
            "keyName": "Bandwidth ",
            "keyValue": "1 nm",
            "specificationType": null
        },
        {
            "id": 105,
            "categoryId": 14,
            "keyName": "Min Wavelength (nm)",
            "keyValue": "\t190",
            "specificationType": null
        },
        {
            "id": 106,
            "categoryId": 14,
            "keyName": "Max Wavelength (nm)",
            "keyValue": "\t1100",
            "specificationType": null
        },
        {
            "id": 107,
            "categoryId": 14,
            "keyName": "Wavelength Accuracy",
            "keyValue": "\t±0.1 nm",
            "specificationType": null
        },
        {
            "id": 108,
            "categoryId": 14,
            "keyName": "Wavelength Reproducibility",
            "keyValue": "\t±0.1 nm",
            "specificationType": null
        },
        {
            "id": 109,
            "categoryId": 14,
            "keyName": "Min Photometric - Transmittance (%T)",
            "keyValue": "\t0",
            "specificationType": null
        },
        {
            "id": 110,
            "categoryId": 14,
            "keyName": "Max Photometric - Transmittance (%T)",
            "keyValue": "\t400",
            "specificationType": null
        },
        {
            "id": 111,
            "categoryId": 14,
            "keyName": "Min Photometric - Absorbance (A)",
            "keyValue": "\t-4",
            "specificationType": null
        },
        {
            "id": 112,
            "categoryId": 14,
            "keyName": "Max Photometric - Absorbance (A)",
            "keyValue": "\t4",
            "specificationType": null
        },
        {
            "id": 113,
            "categoryId": 14,
            "keyName": "Photometric Drift",
            "keyValue": "\t<0.0003 A/hr",
            "specificationType": null
        },
        {
            "id": 114,
            "categoryId": 14,
            "keyName": "Detector\tSilicon",
            "keyValue": " photodiode",
            "specificationType": null
        },
        {
            "id": 115,
            "categoryId": 8,
            "keyName": "PDI Scan range",
            "keyValue": "\t190 nm to 800 nm",
            "specificationType": null
        },
        {
            "id": 116,
            "categoryId": 8,
            "keyName": "Injection mode",
            "keyValue": "\tAuto sampler ",
            "specificationType": null
        },
        {
            "id": 117,
            "categoryId": 8,
            "keyName": "Column Oven Temperature Range",
            "keyValue": "\t5 °C to 80 °C",
            "specificationType": null
        },
        {
            "id": 118,
            "categoryId": 2,
            "keyName": "2O Angular range",
            "keyValue": "\t <6 to >120",
            "specificationType": null
        },
        {
            "id": 119,
            "categoryId": 2,
            "keyName": "Energy Resolution",
            "keyValue": " \t< 380 eV @ 8 KeV",
            "specificationType": null
        },
        {
            "id": 120,
            "categoryId": 2,
            "keyName": "Twist.Tube",
            "keyValue": "\tEasy, fast, and alignment-free switch between line and point focus applications",
            "specificationType": null
        },
        {
            "id": 121,
            "categoryId": 2,
            "keyName": "D8 Goniometer",
            "keyValue": "\tTwo-circle goniometer with independent stepper motors and optical encoders",
            "specificationType": null
        },
        {
            "id": 122,
            "categoryId": 2,
            "keyName": "Detection Modes",
            "keyValue": "0D,1D, 2D",
            "specificationType": null
        },
        {
            "id": 123,
            "categoryId": 2,
            "keyName": "Wavelengths",
            "keyValue": "\tCu",
            "specificationType": null
        },
        {
            "id": 127,
            "categoryId": 13,
            "keyName": "Size measurement",
            "keyValue": "\t0.3 nm (diameter) to 5 µm using 90° scattering optics",
            "specificationType": null
        },
        {
            "id": 128,
            "categoryId": 13,
            "keyName": "Laser ",
            "keyValue": "\tHeNe laser, Blue label: 4 mW Max, Red label: 10 mW Max at 633 nm",
            "specificationType": null
        },
        {
            "id": 129,
            "categoryId": 13,
            "keyName": "Temperature control range",
            "keyValue": "\t0°C to 120°C",
            "specificationType": null
        },
        {
            "id": 133,
            "categoryId": 15,
            "keyName": "Spectrometer ",
            "keyValue": "Double-spectrometer optical system with low UV (165-190 nm) performance (Using Nitrogen Gas)",
            "specificationType": null
        },
        {
            "id": 134,
            "categoryId": 15,
            "keyName": "Spectral range ",
            "keyValue": "165-900 nm with resolution of < 0.009 nm @ 200 nm",
            "specificationType": null
        },
        {
            "id": 135,
            "categoryId": 15,
            "keyName": "Detector ",
            "keyValue": "The UV-sensitive, dual backside-illuminated Charge-Coupled Device (CCD) array detector",
            "specificationType": null
        },
        {
            "id": 136,
            "categoryId": 15,
            "keyName": "RF generator",
            "keyValue": "A fourth-generation 40 MHz, free-running solid-state RF generator, adjustable from 750 to 1500 watts, in 1 watt increments.",
            "specificationType": null
        },
        {
            "id": 137,
            "categoryId": 15,
            "keyName": "Ignition and power control",
            "keyValue": "Plasma ignition is computer-controlled and totally automated",
            "specificationType": null
        }
    ];

    const  DataItems = [
        {
            "id": 1,
            "instrumentId": 0,
            "instrumentName": "Field Emission Scanning Electron Microscope, FESEM JEOL JSM-7610F-PLUS",
            "categoryId": 1,
            "isActive": true,
            "description": "The Jeol field emission scanning electron microscope is a versatile high resolution scanning electron microscope. This Machine combines two proven technologies – an electron column with semi-in-lens objective lens which can provide high resolution imaging by low accelerating voltage and an in-lens Schottky FEG which can provide stable large probe current – to deliver ultrahigh resolution with wide range of probe currents for all applications (A few pA to more than 200 nA). The in-lens Schottky FEG is a combination of a Schottky FEG and the first condenser lens and is designed to collect the electrons from the emitter efficiently. The Gentle Beam (GB) mode applies a negative voltage to a specimen and decelerates incident electrons just before they irradiate the specimen, thus the resolution is improved at an extremely low accelerating voltage. Therefore, this instrument is possible to observe a topmost surface by a few hundred eV which were difficult to observe conventionally and nonconductive samples \r\nsuch as ceramics and semiconductor etc. The High-Power Optics produces fine electron probe for both observation and analysis. The aperture angle control lens maintains a small probe diameter even at a larger probe current. Using both techniques, the machine is suitable for a wide variety of analysis with EDS.\r\nApart from giving the high resolution surface morphological images, this machine also has the analytical capabilities such as detecting the presence of elements down to boron (B) on any solid conducting materials through the energy dispersive X-ray spectrometry (EDX) providing crystalline information from the few nano meter depth of the material surface via electron back scattered detection (BSD) system attached with microscope. ",
            "imageUrl": "https://files.lpu.in/umsweb/CIFDocuments/Instrument_23899918_2_2025_100006_FESEM-Instrument.JPG"
        },
        {
            "id": 2,
            "instrumentId": 0,
            "instrumentName": "Powder XRD (Bruker D8 Advance)",
            "categoryId": 2,
            "isActive": true,
            "description": "This Bruker equipment benchmark when it comes to extracting structural information from X-Ray Powder Diffraction including Rietveld (TOPAS) analysis, \"total\" scattering (PDF analysis), and Small Angle X-Ray Scattering (SAXS). \r\n\r\nMonochromatic Ka1 radiation with Johansson monochromators for Co, Cu and Mo radiation Highest intensity with focusing Göbel mirrors for Cr, Co, Cu, Mo and Ag radiation.\r\nDynamic Beam Optimization\r\nDynamic Beam Optimization (DBO) provides best in class powder diffraction data by setting new benchmarks in terms of counting statistics and peak-to-background ratio, all without the need for manual instrument reconfiguration.\r\n\r\nThe high-speed energy-dispersive LYNXEYE XE-T detector uniquely combines fast data collection with unprecedented filtering of fluorescence and Kß radiation. Its proprietary Variable Active Detector Window and the Motorized Anti-Scatter Screen (MASS) enable data collection from lowest 2? angles without parasitic low-angle background scattering, in particular air scattering. The fully automated MASS retraction avoids beam cropping, even in combination with continuously variable slits that provide superb counting statistics over the whole angular range.\r\n•\tSuperb counting statistics allows for faster data collection and increased sample throughput\r\n•\tNo parasitic low-angle background scattering massively improves data quality of pharma, clay, zeolite and other samples having a large unit cell\r\n•\tBest peak-to-background enhances sensitivity for minor phases\r\n•\tFull quantification of crystalline and amorphous phases with DIFFRACTOPAS\r\n",
            "imageUrl": "https://files.lpu.in/umsweb/CIFDocuments/Instrument_2005552723_2_2025_100009_XRD-Instrument.JPG"
        },
        {
            "id": 3,
            "instrumentId": 0,
            "instrumentName": "FTIR with Diamond ATR & Pellet accessories (Perkin Elmer Spectrum 2)",
            "categoryId": 3,
            "isActive": true,
            "description": "In Infrared spectroscopy or vibrational spectroscopy is used to study the chemical composition of a sample. IR-radiations interact with the sample to produce infrared spectrum. Molecules with an overall electric dipole are when exposed to IR-radiation fluctuates the electromagnetic (EM) radiation. These fluctuations are the foot-prints of chemical compositions of the sample. Hence, to study the chemical composition of the sample the fluctuations of EM-radiations are recorded by the spectrophotometer. Fourier transform is employed to get the signal. Attenuated total reflection (ATR) is a sampling technique used in conjunction with infrared spectroscopy which enables samples to be examined directly in the solid or liquid state without further preparation. A unique humidity shield design protects Spectrum. Two from environmental effects allowing it to be used in more challenging environments, and with extended intervals between desiccant change to lower maintenance costs.\r\nAtmospheric Vapor Compensation (AVC) features an advanced digital filtering algorithm designated to subtract CO2 and H2O absorptions automatically in real time. The use of Sigma-Delta converters in the digitization of the FT-IR interferogram improves dynamic range, reduces spectral artifacts and increases ordinate linearity. Includes basic transmission functionality with optional fully integrated, robust universal sampling ensures trouble-free measurements.\r\nIt is equipped illuminated LCD display and user full set of extended special functions (i.e., counting of identical pieces, percentage indication, recipe making and many more) which are helpful during use of often repeated measurement activities. Further, RS232C connector allows for connecting computer, label printer or printer to print receipts, reports or weighing results archiving. Printed reports comply with requirements of GLP regulations. Procell software allows for direct transfer of weighing results to Excel spreadsheet\r\n\r\n",
            "imageUrl": "https://files.lpu.in/umsweb/CIFDocuments/Instrument_926534728_2_2025_100014_FTIR-Instrument.JPG"
        },
        {
            "id": 4,
            "instrumentId": 0,
            "instrumentName": "Fluorescence Spectrometer (Perkin Elmer LS6500)",
            "categoryId": 4,
            "isActive": true,
            "description": "Fluorescence spectrophotometry is a technique that analyze the state of sample (normally a biological system) by studying its interactions with fluorescent probe molecules. This interaction is monitored by measuring the changes in the fluorescent probe optical properties. The measurement of fluorescence signals provides a sensitive method of monitoring the biochemical environment of a fluorophore. Fluorophores are polyatomic fluorescent molecules. Instruments have been designed to measure fluorescence intensity, spectrum, lifetime and polarization. The apparatus is equipped with several advanced facilities that can be used for the measurement of a large range of samples. This can also be used measure to understand complex biological processes and enzyme inhibition mechanism. Dyes, LEDs, tracers, solar cells, and organic electroluminescent materials can be analyzed using this technique. \r\n",
            "imageUrl": "https://files.lpu.in/umsweb/CIFDocuments/Instrument_1449097689_2_2025_100011_Flourescence-Instrument.JPG"
        },
        {
            "id": 5,
            "instrumentId": 0,
            "instrumentName": "Thermogravimetric analyzer (Perkin Elmer TGA 4000)",
            "categoryId": 5,
            "isActive": true,
            "description": "\r\nThermogravimetric analysis is an equipment that measures the change in weight and hence mass of a sample with change in temperature. Mass of a sample changes due to various chemical or physical changes sensed by the equipment as thermal events. These chemical/physical changes or thermal evens may be desorption, absorption, sublimation, vaporization, oxidation, reduction and decomposition. The study is carried out by subjecting the sample over a range of temperature can be programmed using the software provided with the equipment.\r\nThe apparatus is equipped with large isothermal zone provides excellent temperature reproducibility. Apart from these rapid furnace cooling facilities using tap water and integral forced air are available that more samples can be studied in less time. A constant environment for the balance maintained by the balance purge gas. This purge gas protects the balance from the reactive sample purge gas as well as materials evolved by the sample. A microbalance is used to measure the change in weight of the sample. The equipment is provided with a corrosion resistant furnace.\r\nIntegrated mass flow controller extends applications flexibility; monitors and controls purge flow rates and allows switching between any two gases. \r\nFew important applications of TGA are listed below:\r\n•\tCompositional analysis\r\n•\tDecomposition temperatures\r\n•\tEngine oil volatility\r\n•\tFlammability studies\r\n•\tMeasurement of volatiles\r\n•\tOxidative and thermal stabilities\r\n•\tCatalyst and coking studies\r\n",
            "imageUrl": "https://files.lpu.in/umsweb/CIFDocuments/Instrument_543001469_2_2025_100012_TGA-Instrument.JPG"
        },
        {
            "id": 6,
            "instrumentId": 0,
            "instrumentName": "Differential scanning calorimeter (Perkin Elmer DSC 6000)",
            "categoryId": 6,
            "isActive": true,
            "description": "Differential Scanning Calorimetry is a thermal analysis technique that measures the exchange of heat energy of any material during a physical or chemical change at constant pressure. The equipment measures the thermal behavior of a sample with respect to an inert sample which does not undergo any change upon heating over the specified range of temperatures. Thermal analysis of the sample can be studied under a controlled heating rate of a very high precision in a wide range of temperatures. These measurements will be carried out under inert environment. Flowing nitrogen gas will be used to achieve inert atmosphere. Oxidative properties can also be studied in flowing oxygen or air environment. The equipment is single-furnace design and uses heat-flux measurement principle. The equipment uses thermocouple-based temperature sensors. It has optional UV photocalorimeter accessory as well.\r\nThe equipment can be used for several applications. A small list of applications are given below: \r\n•\tGlass transition temperature\r\n•\tMelting points\r\n•\tCrystallization time and temperatures\r\n•\tHeats of melting and crystallization\r\n•\tPercentage of crystallinity\r\n•\tOxidative stabilities\r\n•\tHeat capacity\r\n•\tPurities\r\n•\tThermal stabilities\r\n•\tPolymorphism\r\n•\tTo test the quality of a product\r\n",
            "imageUrl": "https://files.lpu.in/umsweb/CIFDocuments/Instrument_1507892084_2_2025_100013_DSC-Instrument.JPG"
        },
        {
            "id": 9,
            "instrumentId": 0,
            "instrumentName": "Gas Chromatography and Mass Spectroscopy, Shimadzu GCMS TQ8040 NX",
            "categoryId": 7,
            "isActive": true,
            "description": "\r\nThe Gas Chromatograph - Mass Spectrometer, Shimadzu is Equipped with an ion source that features high sensitivity and long-term stability, and a high-efficiency collision cell, the system can provide sensitive, stable analyses over a long period of time. This device can be used for: \r\n•\tIn research and development, production, impurity profiling and quality control departments of pharmaceutical, chemical, agricultural, and biotechnological industries.\r\n•\tIn forensic toxicology to identify poisons and steroids in biological specimens.\r\n•\tIn detecting pollutants, metabolites in serum and fatty acid profiling in microbes.\r\n•\tFor the analysis of inorganic gases, aromatic solvents, detection of impurities and allergens in cosmetics.",
            "imageUrl": "https://files.lpu.in/umsweb/CIFDocuments/Instrument_2009182246_2_2025_100008_GCMS-Instrument.JPG"
        },
        {
            "id": 10,
            "instrumentId": 0,
            "instrumentName": "High Performance and Liquid Chromatography, Shimadzu Prominence LPGE",
            "categoryId": 8,
            "isActive": true,
            "description": "\r\n This Shimadzu equipment is used in the analysis of pharmaceutical, toxicological, environmental, and biological samples. \r\n\r\n•\tQualitative analysis - Separation of thermally unstable chemical and biological compounds, e.g., drugs, organic chemicals, herbal medicines and plant extracts.\r\n•\tQuantitative analysis - To determine the concentration of a compound in a sample by measuring the height and area of the peak.\r\n•\tTrace analysis – Analysis of compounds present in very low concentrations in a sample. \r\nRI detector (universal detector) - Any component that differs in refractive index from an elute can be detected despite its low sensitivity. difficult to observe conventionally and nonconductive samples such as ceramics and semiconductor etc.\r\nMultiple solvent delivery options, a broad range of flows, and isocratic or gradient elution. PDA and RI detector options to cover a range of sample chemistries. Expandable valving options from simple to complex flow paths.\r\n",
            "imageUrl": "https://files.lpu.in/umsweb/CIFDocuments/Instrument_34620374_2_2025_100007_HPLC-Instrument.JPG"
        },
        {
            "id": 11,
            "instrumentId": 0,
            "instrumentName": "Electrochemical workstation, Metrohm: Multi-Channel Autolab AUT.MAC.204",
            "categoryId": 9,
            "isActive": true,
            "description": "\r\nMetrohum is a multi-channel Potentiostat/galvanostat which is useful in electrochemical measurements. It is a multi-channel potentiostat/galvanostat based on the compact Autolab PGSTAT204. This machine can be controlled from up to three different computers simultaneously, allowing to share, the available channels among different users. Further, this instrument is connected with FRA32M - Impedance analyzer which can perform EIS measurements and comes with a powerful fit and simulation software for the analysis of impedance data. Hence addition of FRA32M in the main unit allows users to perform both potentiostatic and galvanostatic impedance measurements over a wide frequency range of 10 µHz to 32 MHz (limited to 1 MHz in combination with the Autolab PGSTAT). In addition to the classical EIS, the NOVA software also allows the users to modulate other outside signals such as rotation speed of a rotating disk electrode or the frequency of a light source to perform Electro-hydrodynamic or Photo-modulated impedance spectroscopy. Further, For high current applications, M204 module can be connected to a BOOSTER10A to increase the maximum current to 10 A and with its fast response time, the Autolab booster is able to perform electrochemical impedance measurements, in combination with the FRA32M module.\r\nThe in-house available features e.g., cyclic voltammetry, linear sweep voltammetry, chronoamperometry, impedance spectroscopy, charge discharge characteristics provide powerful techniques for understanding reaction kinetics, sensing materials, corrosion, energy conversion and storage studies etc.\r\n",
            "imageUrl": "https://files.lpu.in/umsweb/CIFDocuments/Instrument_1060204202_3_2026_100000_ADP_2248.JPG"
        },
        {
            "id": 12,
            "instrumentId": 0,
            "instrumentName": "Density merer (Axis Density Meter with analytical balance ALN-220)",
            "categoryId": 10,
            "isActive": true,
            "description": "\r\nDensity Meter with analytical balance, Wensar MAB-220T is a mechanical tool which is used to determine the density of solids allowing efficient measuring object mass at immersion in a liquid. Weighing and density determining is done by balance equipped with HYDRO special function performing arithmetical calculations. The MAB-220T analytical balanced used for the density measurements is a very high precision analytical balance for weight measurement. This analytical balance has a calibration system with internal weight, which assures maintaining of measurements precision during operation without user’s intervention.\r\n\r\nIt is equipped illuminated LCD display and user full set of extended special functions (i.e., counting of identical pieces, percentage indication, recipe making and many more) which are helpful during use of often repeated measurement activities. Further, RS232C connector allows for connecting computer, label printer or printer to print receipts, reports or weighing results archiving. Printed reports comply with requirements of GLP regulations. Procell software allows for direct transfer of weighing results to Excel spreadsheet. \r\n\r\n",
            "imageUrl": "https://files.lpu.in/umsweb/CIFDocuments/Instrument_382530855_2_2025_100002_Density_Meter-Instrument.jpg"
        },
        {
            "id": 13,
            "instrumentId": 0,
            "instrumentName": "Refrigerated Centrifuge (Eppendorf  5804R)",
            "categoryId": 11,
            "isActive": true,
            "description": "\r\nRefrigerated Centrifuge is a high speed centrifuge for medium capacity needs. It allows for molecular applications in tubes up to 250 mL and offers additional swing–bucket and fixed–angle rotors as well as deep well plate capacity for increased versatility. Refrigerated Centrifuge is equipped with swing-bucket rotor A-4-44, 15/50 ml adapters and fixed-angle rotor F45-30-11 30 x 1.5/2 ml. A low temperature centrifuge is used to determine sedimentation velocity, shape and mass of macromolecules, separation of phases, isolate viruses, organelles, membranes and biomolecules such as DNA, RNA and lipoproteins. This can also be used for phase separation of nanomaterials\r\n",
            "imageUrl": "https://files.lpu.in/umsweb/CIFDocuments/Instrument_259413724_2_2025_100003_Refrigerated_Centirfuge-Instrument.JPG"
        },
        {
            "id": 14,
            "instrumentId": 0,
            "instrumentName": "Viscometer (LABMAN model of LMDV-200 with small sample adaptor low viscosity adaptor and software.)",
            "categoryId": 12,
            "isActive": true,
            "description": "\r\nThis Labman machine is Rotational Digital Direct Reading Viscometer to measure absolute viscosity of Newton Liquids as well apparent viscosity of non – Newton liquid featured by high flexibility reliable Test result, easy operation and good appearance. The Salient Features of the viscometer are auto range function, selectable speed direct viscosity reading and temperature display with big ultra-bright backlight LCD Display the High-Power Optics produces fine electron probe for both observation and analysis. The aperture angle control lens maintains a small probe diameter even at a larger probe current. Using both techniques, this machine is suitable for a wide variety of analysis with EDS. \r\n",
            "imageUrl": "https://files.lpu.in/umsweb/CIFDocuments/Instrument_696381150_2_2025_100001_ADP_2298---.JPG"
        },
        {
            "id": 15,
            "instrumentId": 0,
            "instrumentName": "Particle size and Zeta potential analyzer (Malverrn Zetasizer Nano ZS90)",
            "categoryId": 13,
            "isActive": true,
            "description": "\r\n  Light scattering is a fundamental analytical technique for the characterization of particulate materials,\r\n  and is most commonly applied to colloidal systems, nanoparticles and macromolecules in solution or dispersion, \r\n  to determine particle size and Zeta Potential. Malvern Particle Size and\r\n  Zeta Potential Analyzer is used to measure particle and molecular size from less than a nanometre to several microns \r\n  using dynamic light scattering and Zeta Potential by using electrophoretic light scattering.\r\n  The particle size analyzer is the ideal tool for sub-micron analysis of size and zeta potential of dispersed particles of mineral, \r\n  chemical, ceramic, polymer, pharmaceutical and agricultural sciences. \r\n  The Zetasizer Nano ZS90 is the perfect lower cost solution when the ultimate in sizing sensitivity is not necessary, \r\n  or where identical results to a legacy system with 90° scattering optics is required. \r\n  • Zeta potential of colloids and nanoparticles using patented M3-PALS technology. \r\n  • A ‘Quality Factor’ and ‘Expert Advice System’ gives the confidence of having an expert at your shoulder.\r\n  • Research software option gives access to further features and analysis algorithms for the light scattering specialist. \r\n  • Automation of measurements using an auto titrator option. \r\n  ",
            "imageUrl": "https://files.lpu.in/umsweb/CIFDocuments/Instrument_284316046_2_2025_100010_Particle_Size-Instrument.JPG"
        },
        {
            "id": 21,
            "instrumentId": 0,
            "instrumentName": "Shimadzu UV-1800 UV-Vis",
            "categoryId": 14,
            "isActive": true,
            "description": "The UV-1800 is an advanced high-resolution (1-nm resolution in a compact double-beam instrument) spectrophotometer utilizing a precision Czerny-Turner optical system. The instrument is extremely versatile with full functionality from 190 nm to 1100 nm.  Operation can be either as a stand-alone instrument or as a PC-controlled instrument with the included UV Probe software. USB memory can be connected directly to the UV-1800 for simple data transfer.",
            "imageUrl": "https://files.lpu.in/umsweb/CIFDocuments/Instrument_1208223655_17_2025_100004_-14-UV.JPG"
        },
        {
            "id": 22,
            "instrumentId": 0,
            "instrumentName": "ICP-OES, PerkinElmer Optima 8000",
            "categoryId": 15,
            "isActive": true,
            "description": "The Optima 8000 is a bench-top, dual-view ICP-OES with full-wavelength-range CCD array detector, delivering flexibility and excellent analytical performance. The Optima™ 8000 ICP-OES gains its outstanding analytical performance from its novel optical system, including a unique double monochromator, dual backside-illuminated charge-coupled device (DBI-CCD) detector, real-time Dynamic Wavelength Stabilization™, and automatic dual viewing of the plasma torch. \r\nKey benefit: \r\n- Superior quantum efficiency, for enhanced analytical performance and superior detection limits\r\n- Simultaneous background correction, further improving analytical accuracy and  detection limits\r\n- Dynamic wavelength stabilization, increasing analytical reproducibility and reliability\r\nICP-OES is a versatile method by which elemental analysis can be done effectively on a variety of test samples containing a complex matrix or having a high level of dissolved solids for different application e.g.,  water quality and safety, soil analysis, Environmental and agro-chemical analysis, food safety, pharmaceutical analysis, Chemical analysis, Metallurgy analysis,  Materials sciences.",
            "imageUrl": "https://files.lpu.in/umsweb/CIFDocuments/Instrument_323568347_3_2025_100005_ICP-OES-Instrument-21.jpg"
        },
        {
            "id": 23,
            "instrumentId": 0,
            "instrumentName": "Distilled Water (milli-Q water)",
            "categoryId": 0,
            "isActive": true,
            "description": null,
            "imageUrl": "https://files.lpu.in/umsweb/CIFDocuments/Instrument_507378691_3_2025_100015_noImage.jpg"
        }
    ];
  const router = useRouter();
  const searchParams = useSearchParams();

  const name = searchParams.get('name');
  const id = searchParams.get('id');
  const catId = searchParams.get('categoryId');

  const [data, setData] = useState<any[]>(DataItems);
  const [specs, setSpecs] = useState<any[]>(AllSpecifications);
  const [charges, setCharges] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [insts, allSpecs] = await Promise.all([
          instrumentService.getAllInstruments(),
          instrumentService.getSpecifications()
        ]);
        // Only update data if we have valid array with items
        if (Array.isArray(insts) && insts.length > 0) {
          setData(insts);
        }
        if (Array.isArray(allSpecs) && allSpecs.length > 0) {
          setSpecs(allSpecs);
        }
        setError('');
      } catch (err: any) {
        console.error('Error fetching instruments:', err);
        // Don't set error - let static data be used as fallback
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSelect = (categoryId: number, instrumentId: number) => {
    router.push(`/OurInstruments?id=${instrumentId}&categoryId=${categoryId}`, { scroll: false });
  };

  const handleViewCharges = async () => {
    if (!id) return;
    try {
      const response = await instrumentService.getCharges(Number(id));
      setCharges(response);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching charges:", error);
    }
  };

  const selectedInstrument = data.find(ins => ins.id === Number(id));
  const filteredSpecs = specs.filter(s => s.categoryId === Number(catId));

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      {loading && (
        <div className="fullScreenLoader">
          <div className="customSpinnerOverlay">
            <img src="/assets/images/spinner.gif" alt="Loading..." />
          </div>
        </div>
      )}

      <main>
        {error && (
          <div className="container mt-3">
            <div className="alert alert-secondary d-flex align-items-center" role="alert">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16">
                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
              </svg>
              <div>
                <strong>Error:</strong> {error}
              </div>
            </div>
          </div>
        )}
        <section className={styles.section + " py-5"}>
          <div className="container">
            <InstrumentGrid
              instruments={data}
              selectedId={id ? Number(id) : null}
              onSelect={handleSelect}
            />
          </div>
        </section>

        {selectedInstrument && (
          <InstrumentDetails
            instrument={selectedInstrument}
            specs={filteredSpecs}
            onViewCharges={handleViewCharges}
          />
        )}

        <FaqSection />

        {showModal && (
          <ChargesModal
            charges={charges}
            onClose={() => setShowModal(false)}
          />
        )}
      </main>
    </>
  );
}

export default function OurInstrumentsPage() {
  return (
    <Suspense fallback={<div>Loading Page...</div>}>
        <AboutSection/>
      <InstrumentsContent />
    </Suspense>
  );
}