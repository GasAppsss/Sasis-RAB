import React, { useState, useEffect, useRef } from 'react';
import {
  Plus, Pencil, Trash2, X, Search, ArrowLeft, Printer, Calculator, Coins, FolderKanban,
  AlertTriangle, Ruler, Copy, ChevronDown, ChevronRight, FileDown,
} from 'lucide-react';
import { supabase, supabaseConfigured } from './supabaseClient';

// ============================================================
// CONSTANTS
// ============================================================
const KATEGORI_PEKERJAAN = [
  'Pekerjaan Persiapan',
  'Pekerjaan Tanah & Pondasi',
  'Pekerjaan Struktur Beton',
  'Pekerjaan Dinding',
  'Pekerjaan Atap',
  'Pekerjaan Plafond',
  'Pekerjaan Lantai',
  'Pekerjaan Pintu & Jendela',
  'Pekerjaan Sanitasi & Plumbing',
  'Pekerjaan Elektrikal',
  'Pekerjaan Pengecatan',
];
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
const KAT_LABEL = { bahan: 'Bahan', upah: 'Upah', alat: 'Alat' };

// ============================================================
// SEED DATA (dipakai sekali untuk mengisi database Supabase yang masih kosong)
// ============================================================
const SAMPLE_PRICES = [
  { id: 'h01', kategori: 'bahan', nama: 'Semen Portland (PC)', satuan: 'zak (50kg)', harga: 65000 },
  { id: 'h02', kategori: 'bahan', nama: 'Pasir Pasang', satuan: 'm3', harga: 250000 },
  { id: 'h03', kategori: 'bahan', nama: 'Pasir Beton', satuan: 'm3', harga: 280000 },
  { id: 'h04', kategori: 'bahan', nama: 'Pasir Urug', satuan: 'm3', harga: 200000 },
  { id: 'h05', kategori: 'bahan', nama: 'Tanah Urug (didatangkan)', satuan: 'm3', harga: 150000 },
  { id: 'h06', kategori: 'bahan', nama: 'Batu Kali', satuan: 'm3', harga: 275000 },
  { id: 'h07', kategori: 'bahan', nama: 'Split / Koral Beton 2/3', satuan: 'm3', harga: 300000 },
  { id: 'h08', kategori: 'bahan', nama: 'Bata Merah', satuan: 'bh', harga: 800 },
  { id: 'h09', kategori: 'bahan', nama: 'Besi Beton Polos/Ulir', satuan: 'kg', harga: 15000 },
  { id: 'h10', kategori: 'bahan', nama: 'Kawat Beton (Bendrat)', satuan: 'kg', harga: 25000 },
  { id: 'h11', kategori: 'bahan', nama: 'Kayu Kelas II (5/7)', satuan: 'm3', harga: 3500000 },
  { id: 'h12', kategori: 'bahan', nama: 'Kayu Kelas I (Kusen)', satuan: 'm3', harga: 5500000 },
  { id: 'h13', kategori: 'bahan', nama: 'Multiplek 9mm', satuan: 'lembar', harga: 150000 },
  { id: 'h14', kategori: 'bahan', nama: 'Paku', satuan: 'kg', harga: 20000 },
  { id: 'h15', kategori: 'bahan', nama: 'Baja Ringan (Rangka Atap)', satuan: 'm1', harga: 45000 },
  { id: 'h16', kategori: 'bahan', nama: 'Genteng Metal', satuan: 'lembar', harga: 65000 },
  { id: 'h17', kategori: 'bahan', nama: 'Genteng Metal Nok', satuan: 'bh', harga: 75000 },
  { id: 'h18', kategori: 'bahan', nama: 'Rangka Hollow Galvalum', satuan: 'm1', harga: 18000 },
  { id: 'h19', kategori: 'bahan', nama: 'Gypsum Board 9mm', satuan: 'lembar', harga: 65000 },
  { id: 'h20', kategori: 'bahan', nama: 'Keramik Lantai 40x40', satuan: 'm2', harga: 65000 },
  { id: 'h21', kategori: 'bahan', nama: 'Keramik Dinding 20x25', satuan: 'm2', harga: 55000 },
  { id: 'h22', kategori: 'bahan', nama: 'Daun Pintu Panel Kayu', satuan: 'unit', harga: 850000 },
  { id: 'h23', kategori: 'bahan', nama: 'Aksesoris Pintu (engsel, kunci, dll)', satuan: 'set', harga: 250000 },
  { id: 'h24', kategori: 'bahan', nama: 'Kusen Alumunium', satuan: 'm1', harga: 95000 },
  { id: 'h25', kategori: 'bahan', nama: 'Kaca Bening 5mm', satuan: 'm2', harga: 120000 },
  { id: 'h26', kategori: 'bahan', nama: 'Pipa PVC 1/2" (AW)', satuan: 'm1', harga: 12000 },
  { id: 'h27', kategori: 'bahan', nama: 'Pipa PVC 3" (AW)', satuan: 'm1', harga: 45000 },
  { id: 'h28', kategori: 'bahan', nama: 'Kloset Duduk', satuan: 'unit', harga: 1500000 },
  { id: 'h29', kategori: 'bahan', nama: 'Kabel NYM 2x1.5mm', satuan: 'm1', harga: 8000 },
  { id: 'h30', kategori: 'bahan', nama: 'Saklar / Stop Kontak', satuan: 'bh', harga: 25000 },
  { id: 'h31', kategori: 'bahan', nama: 'Fitting Lampu', satuan: 'bh', harga: 25000 },
  { id: 'h32', kategori: 'bahan', nama: 'Cat Tembok Interior', satuan: 'kg', harga: 35000 },
  { id: 'h33', kategori: 'bahan', nama: 'Cat Tembok Exterior (Weathershield)', satuan: 'kg', harga: 55000 },
  { id: 'h34', kategori: 'bahan', nama: 'Plamir / Dempul Tembok', satuan: 'kg', harga: 12000 },
  { id: 'h35', kategori: 'upah', nama: 'Pekerja / Buruh', satuan: 'OH', harga: 110000 },
  { id: 'h36', kategori: 'upah', nama: 'Tukang Batu', satuan: 'OH', harga: 130000 },
  { id: 'h37', kategori: 'upah', nama: 'Tukang Kayu', satuan: 'OH', harga: 135000 },
  { id: 'h38', kategori: 'upah', nama: 'Tukang Besi', satuan: 'OH', harga: 135000 },
  { id: 'h39', kategori: 'upah', nama: 'Tukang Cat', satuan: 'OH', harga: 125000 },
  { id: 'h40', kategori: 'upah', nama: 'Tukang Listrik', satuan: 'OH', harga: 140000 },
  { id: 'h41', kategori: 'upah', nama: 'Tukang Pipa / Ledeng', satuan: 'OH', harga: 135000 },
  { id: 'h42', kategori: 'upah', nama: 'Tukang Alumunium', satuan: 'OH', harga: 140000 },
  { id: 'h43', kategori: 'upah', nama: 'Tukang Rangka Baja Ringan', satuan: 'OH', harga: 140000 },
  { id: 'h44', kategori: 'upah', nama: 'Kepala Tukang', satuan: 'OH', harga: 145000 },
  { id: 'h45', kategori: 'upah', nama: 'Mandor', satuan: 'OH', harga: 160000 },
  { id: 'h46', kategori: 'alat', nama: 'Sewa Concrete Mixer / Molen', satuan: 'hari', harga: 250000 },
  { id: 'h47', kategori: 'alat', nama: 'Sewa Scaffolding', satuan: 'set/hari', harga: 15000 },
  { id: 'h48', kategori: 'alat', nama: 'Sewa Vibrator Beton', satuan: 'hari', harga: 200000 },
  { id: 'h49', kategori: 'alat', nama: 'Sewa Stamper / Pemadat', satuan: 'hari', harga: 300000 },
  { id: 'h50', kategori: 'alat', nama: 'Sewa Genset', satuan: 'hari', harga: 350000 },
];

const SAMPLE_AHSP = [
  { id: 'p01', kode: 'PR-01', kategori: 'Pekerjaan Persiapan', nama: 'Pembersihan lokasi', satuan: 'm2', komponen: [{ priceId: 'h35', koefisien: 0.1 }] },
  { id: 'p02', kode: 'PR-02', kategori: 'Pekerjaan Persiapan', nama: 'Pengukuran dan pemasangan bouwplank', satuan: 'm1', komponen: [{ priceId: 'h35', koefisien: 0.1 }, { priceId: 'h37', koefisien: 0.1 }, { priceId: 'h11', koefisien: 0.012 }, { priceId: 'h14', koefisien: 0.02 }] },
  { id: 'p03', kode: 'TP-01', kategori: 'Pekerjaan Tanah & Pondasi', nama: 'Galian tanah pondasi', satuan: 'm3', komponen: [{ priceId: 'h35', koefisien: 0.75 }, { priceId: 'h45', koefisien: 0.025 }] },
  { id: 'p04', kode: 'TP-02', kategori: 'Pekerjaan Tanah & Pondasi', nama: 'Urugan pasir bawah pondasi', satuan: 'm3', komponen: [{ priceId: 'h04', koefisien: 1.2 }, { priceId: 'h35', koefisien: 0.3 }, { priceId: 'h45', koefisien: 0.01 }] },
  { id: 'p05', kode: 'TP-03', kategori: 'Pekerjaan Tanah & Pondasi', nama: 'Pasangan pondasi batu kali 1:4', satuan: 'm3', komponen: [{ priceId: 'h06', koefisien: 1.2 }, { priceId: 'h01', koefisien: 3.26 }, { priceId: 'h02', koefisien: 0.52 }, { priceId: 'h36', koefisien: 1.5 }, { priceId: 'h35', koefisien: 3 }, { priceId: 'h44', koefisien: 0.15 }, { priceId: 'h45', koefisien: 0.15 }] },
  { id: 'p06', kode: 'TP-04', kategori: 'Pekerjaan Tanah & Pondasi', nama: 'Urugan tanah peninggian lantai', satuan: 'm3', komponen: [{ priceId: 'h05', koefisien: 1.2 }, { priceId: 'h35', koefisien: 0.3 }, { priceId: 'h45', koefisien: 0.01 }] },
  { id: 'p07', kode: 'SB-01', kategori: 'Pekerjaan Struktur Beton', nama: 'Beton bertulang mutu K-225 (site mix)', satuan: 'm3', komponen: [{ priceId: 'h01', koefisien: 7.42 }, { priceId: 'h03', koefisien: 0.698 }, { priceId: 'h07', koefisien: 0.912 }, { priceId: 'h35', koefisien: 1.65 }, { priceId: 'h36', koefisien: 0.275 }, { priceId: 'h44', koefisien: 0.028 }, { priceId: 'h45', koefisien: 0.083 }, { priceId: 'h46', koefisien: 0.05 }] },
  { id: 'p08', kode: 'SB-02', kategori: 'Pekerjaan Struktur Beton', nama: 'Pembesian beton (besi polos/ulir)', satuan: 'kg', komponen: [{ priceId: 'h09', koefisien: 1.05 }, { priceId: 'h10', koefisien: 0.015 }, { priceId: 'h38', koefisien: 0.007 }, { priceId: 'h35', koefisien: 0.007 }, { priceId: 'h44', koefisien: 0.0007 }, { priceId: 'h45', koefisien: 0.0004 }] },
  { id: 'p09', kode: 'SB-03', kategori: 'Pekerjaan Struktur Beton', nama: 'Bekisting konvensional (multiplek)', satuan: 'm2', komponen: [{ priceId: 'h11', koefisien: 0.04 }, { priceId: 'h13', koefisien: 0.35 }, { priceId: 'h14', koefisien: 0.4 }, { priceId: 'h37', koefisien: 0.66 }, { priceId: 'h35', koefisien: 0.26 }, { priceId: 'h44', koefisien: 0.066 }, { priceId: 'h45', koefisien: 0.033 }] },
  { id: 'p10', kode: 'DD-01', kategori: 'Pekerjaan Dinding', nama: 'Pasangan dinding bata merah 1/2 batu, camp 1:4', satuan: 'm2', komponen: [{ priceId: 'h08', koefisien: 70 }, { priceId: 'h01', koefisien: 0.194 }, { priceId: 'h02', koefisien: 0.043 }, { priceId: 'h36', koefisien: 0.1 }, { priceId: 'h35', koefisien: 0.3 }, { priceId: 'h44', koefisien: 0.01 }, { priceId: 'h45', koefisien: 0.015 }] },
  { id: 'p11', kode: 'DD-02', kategori: 'Pekerjaan Dinding', nama: 'Plesteran dinding camp 1:4 tebal 15mm', satuan: 'm2', komponen: [{ priceId: 'h01', koefisien: 0.104 }, { priceId: 'h02', koefisien: 0.023 }, { priceId: 'h36', koefisien: 0.15 }, { priceId: 'h35', koefisien: 0.3 }, { priceId: 'h44', koefisien: 0.015 }, { priceId: 'h45', koefisien: 0.015 }] },
  { id: 'p12', kode: 'DD-03', kategori: 'Pekerjaan Dinding', nama: 'Acian dinding', satuan: 'm2', komponen: [{ priceId: 'h01', koefisien: 0.065 }, { priceId: 'h36', koefisien: 0.1 }, { priceId: 'h35', koefisien: 0.1 }, { priceId: 'h44', koefisien: 0.01 }, { priceId: 'h45', koefisien: 0.005 }] },
  { id: 'p13', kode: 'AT-01', kategori: 'Pekerjaan Atap', nama: 'Rangka atap baja ringan', satuan: 'm2', komponen: [{ priceId: 'h15', koefisien: 1.2 }, { priceId: 'h43', koefisien: 0.15 }, { priceId: 'h35', koefisien: 0.1 }, { priceId: 'h45', koefisien: 0.0125 }] },
  { id: 'p14', kode: 'AT-02', kategori: 'Pekerjaan Atap', nama: 'Penutup atap genteng metal', satuan: 'm2', komponen: [{ priceId: 'h16', koefisien: 1.05 }, { priceId: 'h37', koefisien: 0.1 }, { priceId: 'h35', koefisien: 0.1 }, { priceId: 'h45', koefisien: 0.01 }] },
  { id: 'p15', kode: 'AT-03', kategori: 'Pekerjaan Atap', nama: 'Pasangan nok / wuwung genteng metal', satuan: 'm1', komponen: [{ priceId: 'h17', koefisien: 1.05 }, { priceId: 'h37', koefisien: 0.15 }, { priceId: 'h35', koefisien: 0.15 }] },
  { id: 'p16', kode: 'PL-01', kategori: 'Pekerjaan Plafond', nama: 'Rangka plafond hollow galvalum', satuan: 'm2', komponen: [{ priceId: 'h18', koefisien: 2.4 }, { priceId: 'h37', koefisien: 0.1 }, { priceId: 'h35', koefisien: 0.1 }, { priceId: 'h45', koefisien: 0.01 }] },
  { id: 'p17', kode: 'PL-02', kategori: 'Pekerjaan Plafond', nama: 'Penutup plafond gypsum board 9mm', satuan: 'm2', komponen: [{ priceId: 'h19', koefisien: 0.35 }, { priceId: 'h37', koefisien: 0.15 }, { priceId: 'h35', koefisien: 0.1 }, { priceId: 'h45', koefisien: 0.0125 }] },
  { id: 'p18', kode: 'LT-01', kategori: 'Pekerjaan Lantai', nama: 'Pasangan keramik lantai 40x40', satuan: 'm2', komponen: [{ priceId: 'h20', koefisien: 1.05 }, { priceId: 'h01', koefisien: 0.2 }, { priceId: 'h02', koefisien: 0.045 }, { priceId: 'h36', koefisien: 0.35 }, { priceId: 'h35', koefisien: 0.35 }, { priceId: 'h44', koefisien: 0.035 }, { priceId: 'h45', koefisien: 0.0175 }] },
  { id: 'p19', kode: 'LT-02', kategori: 'Pekerjaan Lantai', nama: 'Pasangan keramik dinding KM 20x25', satuan: 'm2', komponen: [{ priceId: 'h21', koefisien: 1.05 }, { priceId: 'h01', koefisien: 0.18 }, { priceId: 'h02', koefisien: 0.02 }, { priceId: 'h36', koefisien: 0.4 }, { priceId: 'h35', koefisien: 0.2 }, { priceId: 'h44', koefisien: 0.04 }, { priceId: 'h45', koefisien: 0.02 }] },
  { id: 'p20', kode: 'PJ-01', kategori: 'Pekerjaan Pintu & Jendela', nama: 'Pasang pintu panel kayu lengkap kusen', satuan: 'unit', komponen: [{ priceId: 'h12', koefisien: 0.045 }, { priceId: 'h22', koefisien: 1 }, { priceId: 'h23', koefisien: 1 }, { priceId: 'h37', koefisien: 1.5 }, { priceId: 'h35', koefisien: 0.75 }, { priceId: 'h44', koefisien: 0.15 }, { priceId: 'h45', koefisien: 0.075 }] },
  { id: 'p21', kode: 'PJ-02', kategori: 'Pekerjaan Pintu & Jendela', nama: 'Pasang jendela kaca rangka alumunium', satuan: 'm2', komponen: [{ priceId: 'h24', koefisien: 2.4 }, { priceId: 'h25', koefisien: 1 }, { priceId: 'h42', koefisien: 0.5 }, { priceId: 'h35', koefisien: 0.25 }, { priceId: 'h45', koefisien: 0.025 }] },
  { id: 'p22', kode: 'SP-01', kategori: 'Pekerjaan Sanitasi & Plumbing', nama: 'Instalasi pipa air bersih PVC 1/2"', satuan: 'm1', komponen: [{ priceId: 'h26', koefisien: 1.05 }, { priceId: 'h41', koefisien: 0.05 }, { priceId: 'h35', koefisien: 0.05 }, { priceId: 'h45', koefisien: 0.005 }] },
  { id: 'p23', kode: 'SP-02', kategori: 'Pekerjaan Sanitasi & Plumbing', nama: 'Instalasi pipa air kotor PVC 3"', satuan: 'm1', komponen: [{ priceId: 'h27', koefisien: 1.05 }, { priceId: 'h41', koefisien: 0.08 }, { priceId: 'h35', koefisien: 0.08 }, { priceId: 'h45', koefisien: 0.008 }] },
  { id: 'p24', kode: 'SP-03', kategori: 'Pekerjaan Sanitasi & Plumbing', nama: 'Pasang kloset duduk', satuan: 'unit', komponen: [{ priceId: 'h28', koefisien: 1 }, { priceId: 'h41', koefisien: 1 }, { priceId: 'h35', koefisien: 0.5 }, { priceId: 'h45', koefisien: 0.05 }] },
  { id: 'p25', kode: 'EL-01', kategori: 'Pekerjaan Elektrikal', nama: 'Instalasi titik lampu', satuan: 'titik', komponen: [{ priceId: 'h29', koefisien: 6 }, { priceId: 'h31', koefisien: 1 }, { priceId: 'h40', koefisien: 0.35 }, { priceId: 'h35', koefisien: 0.15 }, { priceId: 'h45', koefisien: 0.015 }] },
  { id: 'p26', kode: 'EL-02', kategori: 'Pekerjaan Elektrikal', nama: 'Instalasi titik stop kontak', satuan: 'titik', komponen: [{ priceId: 'h29', koefisien: 5 }, { priceId: 'h30', koefisien: 1 }, { priceId: 'h40', koefisien: 0.3 }, { priceId: 'h35', koefisien: 0.15 }, { priceId: 'h45', koefisien: 0.015 }] },
  { id: 'p27', kode: 'CT-01', kategori: 'Pekerjaan Pengecatan', nama: 'Cat tembok interior (2 lapis)', satuan: 'm2', komponen: [{ priceId: 'h32', koefisien: 0.26 }, { priceId: 'h34', koefisien: 0.1 }, { priceId: 'h39', koefisien: 0.07 }, { priceId: 'h35', koefisien: 0.03 }, { priceId: 'h45', koefisien: 0.005 }] },
  { id: 'p28', kode: 'CT-02', kategori: 'Pekerjaan Pengecatan', nama: 'Cat tembok exterior weathershield (2 lapis)', satuan: 'm2', komponen: [{ priceId: 'h33', koefisien: 0.26 }, { priceId: 'h34', koefisien: 0.1 }, { priceId: 'h39', koefisien: 0.08 }, { priceId: 'h35', koefisien: 0.03 }, { priceId: 'h45', koefisien: 0.005 }] },
];

const buildSampleProjects = () => [{
  id: 'proj_sample_1',
  nama: 'Rumah Tinggal Type 45 - Bpk. Ahmad',
  lokasi: 'Bandung, Jawa Barat',
  tanggal: '2026-09-01',
  buk: 12,
  ppn: 11,
  items: [
    { id: 'it01', ahspId: 'p01', volume: 90, catatan: '' },
    { id: 'it02', ahspId: 'p02', volume: 28, catatan: '' },
    { id: 'it03', ahspId: 'p03', volume: 12, catatan: '' },
    { id: 'it04', ahspId: 'p04', volume: 2.4, catatan: '' },
    { id: 'it05', ahspId: 'p05', volume: 8, catatan: '' },
    { id: 'it06', ahspId: 'p07', volume: 3.5, catatan: 'Sloof + kolom praktis' },
    { id: 'it07', ahspId: 'p08', volume: 280, catatan: '' },
    { id: 'it08', ahspId: 'p09', volume: 22, catatan: '' },
    { id: 'it09', ahspId: 'p10', volume: 120, catatan: '' },
    { id: 'it10', ahspId: 'p11', volume: 240, catatan: '2 sisi dinding' },
    { id: 'it11', ahspId: 'p12', volume: 240, catatan: '' },
    { id: 'it12', ahspId: 'p13', volume: 65, catatan: '' },
    { id: 'it13', ahspId: 'p14', volume: 65, catatan: '' },
    { id: 'it14', ahspId: 'p16', volume: 45, catatan: '' },
    { id: 'it15', ahspId: 'p17', volume: 45, catatan: '' },
    { id: 'it16', ahspId: 'p18', volume: 45, catatan: '' },
    { id: 'it17', ahspId: 'p19', volume: 12, catatan: '' },
    { id: 'it18', ahspId: 'p20', volume: 5, catatan: '' },
    { id: 'it19', ahspId: 'p21', volume: 10, catatan: '' },
    { id: 'it20', ahspId: 'p22', volume: 30, catatan: '' },
    { id: 'it21', ahspId: 'p23', volume: 15, catatan: '' },
    { id: 'it22', ahspId: 'p24', volume: 2, catatan: '' },
    { id: 'it23', ahspId: 'p25', volume: 15, catatan: '' },
    { id: 'it24', ahspId: 'p26', volume: 10, catatan: '' },
    { id: 'it25', ahspId: 'p27', volume: 200, catatan: '' },
    { id: 'it26', ahspId: 'p28', volume: 90, catatan: '' },
  ],
}];

// ============================================================
// HELPERS
// ============================================================
let idCounter = 0;
const generateId = (prefix) => { idCounter += 1; return `${prefix}_${Date.now().toString(36)}_${idCounter}`; };

const formatRupiah = (n) => `Rp${Math.round(Number(n) || 0).toLocaleString('id-ID')}`;
const formatAngka = (n) => (Number(n) || 0).toLocaleString('id-ID', { maximumFractionDigits: 4 });

const hitungHargaSatuan = (ahspItem, priceData) => {
  if (!ahspItem || !ahspItem.komponen) return 0;
  return ahspItem.komponen.reduce((sum, k) => {
    const p = priceData.find((x) => x.id === k.priceId);
    return sum + (Number(k.koefisien) || 0) * (p ? p.harga : 0);
  }, 0);
};

const hitungRekap = (project, ahspData, priceData) => {
  const map = {};
  (project.items || []).forEach((item) => {
    const ahsp = ahspData.find((a) => a.id === item.ahspId);
    if (!ahsp) return;
    const jumlah = (Number(item.volume) || 0) * hitungHargaSatuan(ahsp, priceData);
    map[ahsp.kategori] = (map[ahsp.kategori] || 0) + jumlah;
  });
  const subtotal = Object.values(map).reduce((a, b) => a + b, 0);
  const bukPct = Number(project.buk) || 0;
  const ppnPct = Number(project.ppn) || 0;
  const buk = (subtotal * bukPct) / 100;
  const afterBuk = subtotal + buk;
  const ppn = (afterBuk * ppnPct) / 100;
  return { map, subtotal, buk, afterBuk, ppn, total: afterBuk + ppn };
};

const exportProjectToExcel = async (project, ahspData, priceData) => {
  const XLSX = await import('xlsx');
  const rekap = hitungRekap(project, ahspData, priceData);
  const rows = [];
  rows.push([project.nama]);
  rows.push([project.lokasi || '']);
  rows.push([project.tanggal || '']);
  rows.push([]);
  rows.push(['No', 'Kode', 'Uraian Pekerjaan', 'Volume', 'Satuan', 'Harga Satuan', 'Jumlah Harga']);
  let no = 1;
  KATEGORI_PEKERJAAN.forEach((kategori, kIdx) => {
    const items = (project.items || []).filter((it) => {
      const a = ahspData.find((x) => x.id === it.ahspId);
      return a && a.kategori === kategori;
    });
    if (items.length === 0) return;
    rows.push([ROMAN[kIdx], kategori]);
    items.forEach((it) => {
      const ahsp = ahspData.find((a) => a.id === it.ahspId);
      const harga = hitungHargaSatuan(ahsp, priceData);
      rows.push([no, ahsp.kode, ahsp.nama, Number(it.volume) || 0, ahsp.satuan, Math.round(harga), Math.round((Number(it.volume) || 0) * harga)]);
      no += 1;
    });
    rows.push(['', '', `Subtotal ${kategori}`, '', '', '', Math.round(rekap.map[kategori] || 0)]);
  });
  rows.push([]);
  rows.push(['', '', '', '', '', 'Jumlah', Math.round(rekap.subtotal)]);
  rows.push(['', '', '', '', '', `Biaya Umum & Keuntungan (${project.buk}%)`, Math.round(rekap.buk)]);
  rows.push(['', '', '', '', '', 'Subtotal', Math.round(rekap.afterBuk)]);
  rows.push(['', '', '', '', '', `PPN (${project.ppn}%)`, Math.round(rekap.ppn)]);
  rows.push(['', '', '', '', '', 'TOTAL RAB', Math.round(rekap.total)]);

  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = [{ wch: 5 }, { wch: 10 }, { wch: 42 }, { wch: 10 }, { wch: 8 }, { wch: 16 }, { wch: 18 }];
  if (ws['!ref']) {
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let R = range.s.r; R <= range.e.r; R += 1) {
      [5, 6].forEach((C) => {
        const ref = XLSX.utils.encode_cell({ r: R, c: C });
        if (ws[ref] && typeof ws[ref].v === 'number') ws[ref].z = '#,##0';
      });
    }
  }
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'RAB');
  XLSX.writeFile(wb, `RAB - ${project.nama}.xlsx`);
};

// ============================================================
// SHARED UI
// ============================================================
function Modal({ title, onClose, children, wide }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(22,40,61,0.45)' }}>
      <div className="rab-card rab-modal-panel w-full flex flex-col" style={{ backgroundColor: 'var(--surface)', maxWidth: wide ? '640px' : '440px', maxHeight: '88vh' }}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--line)' }}>
          <h3 className="font-semibold text-base" style={{ color: 'var(--ink)' }}>{title}</h3>
          <button onClick={onClose} className="rab-icon-btn" aria-label="Tutup" type="button"><X size={18} /></button>
        </div>
        <div className="px-5 py-4 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

function ConfirmDialog({ title, message, onConfirm, onCancel, danger, confirmLabel, hideCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(22,40,61,0.45)' }}>
      <div className="rab-card rab-modal-panel w-full p-5" style={{ backgroundColor: 'var(--surface)', maxWidth: '380px' }}>
        <div className="flex gap-3 items-start mb-3">
          <div style={{ color: danger ? 'var(--rust)' : 'var(--ink)' }}><AlertTriangle size={22} /></div>
          <div>
            <h3 className="font-semibold text-base mb-1" style={{ color: 'var(--ink)' }}>{title}</h3>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          {!hideCancel && <button onClick={onCancel} className="rab-btn-ghost" type="button">Batal</button>}
          <button onClick={onConfirm} className={danger ? 'rab-btn-danger' : 'rab-btn-primary'} type="button">{confirmLabel || 'Hapus'}</button>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ icon, title, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="mb-3" style={{ color: 'var(--muted)' }}>{icon}</div>
      <h3 className="font-semibold text-base mb-1" style={{ color: 'var(--ink)' }}>{title}</h3>
      <p className="text-sm mb-4" style={{ color: 'var(--muted)', maxWidth: '360px' }}>{description}</p>
      {actionLabel && <button onClick={onAction} className="rab-btn-accent" type="button"><Plus size={16} />{actionLabel}</button>}
    </div>
  );
}

function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="no-print fixed flex justify-center" style={{ bottom: 24, left: 0, right: 0, zIndex: 60, pointerEvents: 'none' }}>
      <div className="rab-modal-panel rab-mono" style={{ backgroundColor: 'var(--ink)', color: '#fff', padding: '10px 18px', borderRadius: '8px', fontSize: '13px', boxShadow: '0 6px 20px rgba(0,0,0,0.18)', maxWidth: '90vw' }}>
        {message}
      </div>
    </div>
  );
}

// ============================================================
// PROJECT FORM MODAL
// ============================================================
function ProjectFormModal({ initial, onSave, onClose }) {
  const [nama, setNama] = useState(initial ? initial.nama : '');
  const [lokasi, setLokasi] = useState(initial ? initial.lokasi : '');
  const [tanggal, setTanggal] = useState(initial ? initial.tanggal : new Date().toISOString().slice(0, 10));

  const submit = (e) => {
    e.preventDefault();
    if (!nama.trim()) return;
    onSave({ nama: nama.trim(), lokasi: lokasi.trim(), tanggal });
  };

  return (
    <Modal title={initial ? 'Edit Proyek' : 'Proyek Baru'} onClose={onClose}>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <div>
          <label className="rab-label">Nama Proyek</label>
          <input className="rab-input" value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Contoh: Rumah Tinggal 2 Lantai - Bpk. Budi" autoFocus />
        </div>
        <div>
          <label className="rab-label">Lokasi</label>
          <input className="rab-input" value={lokasi} onChange={(e) => setLokasi(e.target.value)} placeholder="Contoh: Depok, Jawa Barat" />
        </div>
        <div>
          <label className="rab-label">Tanggal</label>
          <input type="date" className="rab-input" value={tanggal} onChange={(e) => setTanggal(e.target.value)} />
        </div>
        <div className="flex justify-end gap-2 mt-2">
          <button type="button" onClick={onClose} className="rab-btn-ghost">Batal</button>
          <button type="submit" className="rab-btn-primary">Simpan</button>
        </div>
      </form>
    </Modal>
  );
}

// ============================================================
// DASHBOARD
// ============================================================
function Dashboard({ projects, ahspData, priceData, onOpenProject, onAdd, onDelete, onDuplicate }) {
  const [showForm, setShowForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async (data) => {
    setSaving(true);
    const newProject = await onAdd(data);
    setSaving(false);
    setShowForm(false);
    if (newProject) onOpenProject(newProject.id);
  };

  const handleDelete = () => {
    onDelete(confirmDelete);
    setConfirmDelete(null);
  };

  const totalAllProjects = projects.reduce((sum, p) => sum + hitungRekap(p, ahspData, priceData).total, 0);

  return (
    <div>
      <div className="rab-grid-header border-b px-6 py-8 md:px-10" style={{ borderColor: 'var(--line)' }}>
        <div className="max-w-5xl mx-auto flex items-end justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold" style={{ color: 'var(--ink)' }}>Daftar Proyek</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
              {projects.length > 0 ? `${projects.length} proyek dengan total nilai ${formatRupiah(totalAllProjects)}` : 'Kelola Rencana Anggaran Biaya untuk setiap proyek.'}
            </p>
          </div>
          <button onClick={() => setShowForm(true)} className="rab-btn-accent" type="button"><Plus size={16} />Proyek Baru</button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-10 py-8">
        {projects.length === 0 ? (
          <EmptyState icon={<FolderKanban size={40} />} title="Belum ada proyek" description="Buat proyek pertama untuk mulai menyusun RAB." actionLabel="Buat Proyek" onAction={() => setShowForm(true)} />
        ) : (
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {projects.map((project) => {
              const rekap = hitungRekap(project, ahspData, priceData);
              return (
                <div key={project.id} onClick={() => onOpenProject(project.id)} className="rab-card rab-project-card p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-base pr-2" style={{ color: 'var(--ink)' }}>{project.nama}</h3>
                    <div className="flex gap-0.5 flex-shrink-0">
                      <button onClick={(e) => { e.stopPropagation(); onDuplicate(project); }} className="rab-icon-btn" type="button" aria-label="Duplikat"><Copy size={15} /></button>
                      <button onClick={(e) => { e.stopPropagation(); setConfirmDelete(project.id); }} className="rab-icon-btn danger" type="button" aria-label="Hapus"><Trash2 size={15} /></button>
                    </div>
                  </div>
                  <p className="text-sm mb-1" style={{ color: 'var(--muted)' }}>{project.lokasi || 'Lokasi belum diisi'}</p>
                  <p className="text-xs mb-4" style={{ color: 'var(--muted)' }}>{(project.items || []).length} item pekerjaan, {project.tanggal || 'tanggal belum diisi'}</p>
                  <div className="pt-3 border-t" style={{ borderColor: 'var(--line)' }}>
                    <p className="rab-label" style={{ marginBottom: 0 }}>Total RAB</p>
                    <p className="rab-mono text-lg font-semibold" style={{ color: 'var(--rust)' }}>{formatRupiah(rekap.total)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showForm && <ProjectFormModal onSave={handleSave} onClose={() => (!saving && setShowForm(false))} />}
      {confirmDelete && <ConfirmDialog title="Hapus proyek?" message="Semua item pekerjaan pada proyek ini akan ikut terhapus dari database. Tindakan ini tidak bisa dibatalkan." danger onConfirm={handleDelete} onCancel={() => setConfirmDelete(null)} />}
    </div>
  );
}

// ============================================================
// ADD / EDIT ITEM MODALS
// ============================================================
function AddItemModal({ ahspData, priceData, onAdd, onClose, notify }) {
  const [search, setSearch] = useState('');
  const [kategoriFilter, setKategoriFilter] = useState('');
  const [volumes, setVolumes] = useState({});

  const filtered = ahspData.filter((a) => {
    const q = search.toLowerCase();
    const matchSearch = !q || a.nama.toLowerCase().includes(q) || (a.kode || '').toLowerCase().includes(q);
    const matchKategori = !kategoriFilter || a.kategori === kategoriFilter;
    return matchSearch && matchKategori;
  });

  const handleAdd = (ahspId) => {
    const vol = parseFloat(volumes[ahspId]);
    if (!vol || vol <= 0) { notify('Isi volume terlebih dahulu'); return; }
    onAdd(ahspId, vol, '');
    setVolumes({ ...volumes, [ahspId]: '' });
  };

  return (
    <Modal title="Tambah Item Pekerjaan" onClose={onClose} wide>
      <div className="flex flex-col gap-3 mb-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={15} style={{ position: 'absolute', left: 10, top: 11, color: 'var(--muted)' }} />
          <input className="rab-input" style={{ paddingLeft: 32 }} placeholder="Cari item pekerjaan..." value={search} onChange={(e) => setSearch(e.target.value)} autoFocus />
        </div>
        <select className="rab-select" style={{ maxWidth: '220px' }} value={kategoriFilter} onChange={(e) => setKategoriFilter(e.target.value)}>
          <option value="">Semua Kategori</option>
          {KATEGORI_PEKERJAAN.map((k) => <option key={k} value={k}>{k}</option>)}
        </select>
      </div>
      <div className="flex flex-col gap-1.5 overflow-y-auto" style={{ maxHeight: '48vh' }}>
        {filtered.length === 0 ? (
          <p className="text-sm text-center py-8" style={{ color: 'var(--muted)' }}>Tidak ditemukan. Tambahkan item baru lewat Database AHSP.</p>
        ) : filtered.map((a) => {
          const harga = hitungHargaSatuan(a, priceData);
          return (
            <div key={a.id} className="flex items-center gap-2 px-3 py-2.5 rounded-md" style={{ border: '1px solid var(--line)' }}>
              <span className="rab-mono text-xs px-1.5 py-0.5 rounded flex-shrink-0" style={{ backgroundColor: 'var(--paper)', color: 'var(--muted)' }}>{a.kode}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm" style={{ color: 'var(--charcoal)' }}>{a.nama}</p>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>{a.satuan}, {formatRupiah(harga)}</p>
              </div>
              <input type="number" placeholder="Vol" value={volumes[a.id] || ''} onChange={(e) => setVolumes({ ...volumes, [a.id]: e.target.value })} className="rab-input" style={{ width: '68px', textAlign: 'right', flexShrink: 0 }} />
              <button onClick={() => handleAdd(a.id)} className="rab-icon-btn" type="button" style={{ backgroundColor: 'var(--ink)', color: '#fff', flexShrink: 0 }} aria-label="Tambah"><Plus size={15} /></button>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}

function EditItemModal({ item, ahsp, onSave, onClose }) {
  const [volume, setVolume] = useState(item.volume);
  const [catatan, setCatatan] = useState(item.catatan || '');
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const vol = parseFloat(volume);
    if (!vol || vol <= 0) { setError('Volume harus lebih dari 0'); return; }
    onSave(item.id, vol, catatan);
  };

  return (
    <Modal title="Edit Item Pekerjaan" onClose={onClose}>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <div>
          <p className="text-sm font-medium mb-1" style={{ color: 'var(--ink)' }}>{ahsp ? ahsp.nama : '-'}</p>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>{ahsp ? ahsp.satuan : ''}</p>
        </div>
        <div>
          <label className="rab-label">Volume</label>
          <input type="number" step="any" className="rab-input" value={volume} onChange={(e) => { setVolume(e.target.value); setError(''); }} autoFocus />
          {error && <p className="text-xs mt-1" style={{ color: '#B3261E' }}>{error}</p>}
        </div>
        <div>
          <label className="rab-label">Catatan (opsional)</label>
          <input className="rab-input" value={catatan} onChange={(e) => setCatatan(e.target.value)} placeholder="Contoh: khusus lantai 2" />
        </div>
        <div className="flex justify-end gap-2 mt-2">
          <button type="button" onClick={onClose} className="rab-btn-ghost">Batal</button>
          <button type="submit" className="rab-btn-primary">Simpan</button>
        </div>
      </form>
    </Modal>
  );
}

// ============================================================
// PROJECT DETAIL
// ============================================================
function ProjectDetail({ project, ahspData, priceData, onUpdate, onBack, notify }) {
  const [showAddItem, setShowAddItem] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [showEditProject, setShowEditProject] = useState(false);
  const [itemSearch, setItemSearch] = useState('');

  const rekap = hitungRekap(project, ahspData, priceData);
  const updateProject = (patch) => onUpdate(patch);

  const addItem = (ahspId, volume, catatan) => {
    updateProject({ items: [...project.items, { id: generateId('it'), ahspId, volume, catatan: catatan || '' }] });
    notify('Item ditambahkan');
  };
  const saveEditItem = (id, volume, catatan) => {
    updateProject({ items: project.items.map((it) => (it.id === id ? { ...it, volume, catatan } : it)) });
    setEditItem(null);
    notify('Item diperbarui');
  };
  const deleteItem = () => {
    updateProject({ items: project.items.filter((it) => it.id !== deleteItemId) });
    setDeleteItemId(null);
    notify('Item dihapus');
  };

  const visibleItems = project.items.filter((it) => {
    const ahsp = ahspData.find((a) => a.id === it.ahspId);
    if (!ahsp) return false;
    if (itemSearch && !ahsp.nama.toLowerCase().includes(itemSearch.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div className="no-print border-b px-6 md:px-10 py-4" style={{ borderColor: 'var(--line)' }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <button onClick={onBack} className="rab-btn-ghost" type="button"><ArrowLeft size={16} />Semua Proyek</button>
          <div className="flex gap-2 flex-wrap">
            <button onClick={async () => { await exportProjectToExcel(project, ahspData, priceData); notify('File Excel diunduh'); }} className="rab-btn-ghost" type="button"><FileDown size={16} />Excel</button>
            <button onClick={() => window.print()} className="rab-btn-ghost" type="button"><Printer size={16} />Cetak</button>
            <button onClick={() => setShowAddItem(true)} className="rab-btn-accent" type="button"><Plus size={16} />Tambah Item Pekerjaan</button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-10 py-8">
        <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold mb-1" style={{ color: 'var(--ink)' }}>{project.nama}</h1>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>{project.lokasi || 'Lokasi belum diisi'}{project.tanggal ? `, ${project.tanggal}` : ''}</p>
          </div>
          <button onClick={() => setShowEditProject(true)} className="rab-icon-btn no-print" type="button" aria-label="Edit proyek"><Pencil size={16} /></button>
        </div>

        {(project.items || []).length === 0 ? (
          <EmptyState icon={<Calculator size={40} />} title="Belum ada item pekerjaan" description="Tambahkan item pekerjaan dari database AHSP untuk mulai menyusun RAB proyek ini." actionLabel="Tambah Item Pekerjaan" onAction={() => setShowAddItem(true)} />
        ) : (
          <div>
            {project.items.length > 8 && (
              <div className="relative mb-4 no-print" style={{ maxWidth: '320px' }}>
                <Search size={15} style={{ position: 'absolute', left: 10, top: 11, color: 'var(--muted)' }} />
                <input className="rab-input" style={{ paddingLeft: 32 }} placeholder="Cari item pekerjaan di proyek ini..." value={itemSearch} onChange={(e) => setItemSearch(e.target.value)} />
              </div>
            )}

            {itemSearch && visibleItems.length === 0 && (
              <p className="text-sm text-center py-8" style={{ color: 'var(--muted)' }}>Tidak ada item yang cocok dengan pencarian &quot;{itemSearch}&quot;.</p>
            )}

            {KATEGORI_PEKERJAAN.map((kategori, kIdx) => {
              const itemsInKategori = visibleItems.filter((it) => {
                const ahsp = ahspData.find((a) => a.id === it.ahspId);
                return ahsp && ahsp.kategori === kategori;
              });
              if (itemsInKategori.length === 0) return null;
              return (
                <div key={kategori} className="mb-6">
                  <h2 className="text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: 'var(--ink)' }}>
                    <span className="rab-mono" style={{ color: 'var(--rust)' }}>{ROMAN[kIdx]}</span>{kategori}
                  </h2>
                  <div className="rab-card overflow-x-auto">
                    <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                      <thead>
                        <tr className="text-left border-b" style={{ borderColor: 'var(--line)' }}>
                          <th className="px-3 py-2 font-medium" style={{ color: 'var(--muted)' }}>Uraian Pekerjaan</th>
                          <th className="px-3 py-2 font-medium text-right" style={{ color: 'var(--muted)' }}>Volume</th>
                          <th className="px-3 py-2 font-medium" style={{ color: 'var(--muted)' }}>Satuan</th>
                          <th className="px-3 py-2 font-medium text-right" style={{ color: 'var(--muted)' }}>Harga Satuan</th>
                          <th className="px-3 py-2 font-medium text-right" style={{ color: 'var(--muted)' }}>Jumlah</th>
                          <th className="px-3 py-2 font-medium text-right no-print" style={{ color: 'var(--muted)' }}>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {itemsInKategori.map((item) => {
                          const ahsp = ahspData.find((a) => a.id === item.ahspId);
                          const hargaSatuan = hitungHargaSatuan(ahsp, priceData);
                          const jumlah = (Number(item.volume) || 0) * hargaSatuan;
                          return (
                            <tr key={item.id} className="rab-row border-b" style={{ borderColor: 'var(--line)' }}>
                              <td className="px-3 py-2.5">
                                <p style={{ color: 'var(--charcoal)' }}>{ahsp.nama}</p>
                                {item.catatan && <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{item.catatan}</p>}
                              </td>
                              <td className="px-3 py-2.5 text-right rab-mono">{formatAngka(item.volume)}</td>
                              <td className="px-3 py-2.5" style={{ color: 'var(--muted)' }}>{ahsp.satuan}</td>
                              <td className="px-3 py-2.5 text-right rab-mono">{formatRupiah(hargaSatuan)}</td>
                              <td className="px-3 py-2.5 text-right rab-mono font-medium">{formatRupiah(jumlah)}</td>
                              <td className="px-3 py-2.5 no-print">
                                <div className="flex justify-end gap-1">
                                  <button onClick={() => setEditItem(item)} className="rab-icon-btn" type="button" aria-label="Edit"><Pencil size={14} /></button>
                                  <button onClick={() => setDeleteItemId(item.id)} className="rab-icon-btn danger" type="button" aria-label="Hapus"><Trash2 size={14} /></button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-right text-sm mt-1.5 pr-1 rab-mono" style={{ color: 'var(--muted)' }}>
                    Subtotal: <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{formatRupiah(rekap.map[kategori] || 0)}</span>
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {(project.items || []).length > 0 && (
          <div className="rab-card p-6 mt-4" style={{ maxWidth: '420px', marginLeft: 'auto' }}>
            <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--ink)' }}>Rekapitulasi RAB</h3>
            <div className="flex flex-col gap-2.5 text-sm">
              <div className="flex justify-between rab-mono"><span style={{ color: 'var(--muted)', fontFamily: 'inherit' }}>Jumlah</span><span>{formatRupiah(rekap.subtotal)}</span></div>
              <div className="flex justify-between items-center rab-mono">
                <span className="flex items-center gap-1.5" style={{ color: 'var(--muted)', fontFamily: 'inherit' }}>
                  Biaya Umum &amp; Keuntungan
                  <input type="number" value={project.buk} onChange={(e) => updateProject({ buk: parseFloat(e.target.value) || 0 })} className="rab-input no-print" style={{ width: '52px', padding: '2px 4px', textAlign: 'center' }} />
                  <span className="no-print">%</span>
                  <span className="print-only">({project.buk}%)</span>
                </span>
                <span>{formatRupiah(rekap.buk)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t rab-mono" style={{ borderColor: 'var(--line)' }}><span style={{ color: 'var(--muted)', fontFamily: 'inherit' }}>Subtotal</span><span>{formatRupiah(rekap.afterBuk)}</span></div>
              <div className="flex justify-between items-center rab-mono">
                <span className="flex items-center gap-1.5" style={{ color: 'var(--muted)', fontFamily: 'inherit' }}>
                  PPN
                  <input type="number" value={project.ppn} onChange={(e) => updateProject({ ppn: parseFloat(e.target.value) || 0 })} className="rab-input no-print" style={{ width: '52px', padding: '2px 4px', textAlign: 'center' }} />
                  <span className="no-print">%</span>
                  <span className="print-only">({project.ppn}%)</span>
                </span>
                <span>{formatRupiah(rekap.ppn)}</span>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4 p-4 rounded-md" style={{ backgroundColor: 'var(--rust-soft)' }}>
              <span className="font-semibold" style={{ color: 'var(--ink)' }}>Total RAB</span>
              <span className="rab-mono font-bold text-2xl" style={{ color: 'var(--rust)' }}>{formatRupiah(rekap.total)}</span>
            </div>
          </div>
        )}
      </div>

      {showAddItem && <AddItemModal ahspData={ahspData} priceData={priceData} onAdd={addItem} onClose={() => setShowAddItem(false)} notify={notify} />}
      {editItem && <EditItemModal item={editItem} ahsp={ahspData.find((a) => a.id === editItem.ahspId)} onSave={saveEditItem} onClose={() => setEditItem(null)} />}
      {deleteItemId && <ConfirmDialog title="Hapus item?" message="Item pekerjaan ini akan dihapus dari RAB proyek." danger onConfirm={deleteItem} onCancel={() => setDeleteItemId(null)} />}
      {showEditProject && <ProjectFormModal initial={project} onSave={(data) => { updateProject(data); setShowEditProject(false); notify('Proyek diperbarui'); }} onClose={() => setShowEditProject(false)} />}
    </div>
  );
}

// ============================================================
// AHSP FORM MODAL
// ============================================================
function AHSPFormModal({ initial, priceData, onSave, onClose }) {
  const [kode, setKode] = useState(initial ? initial.kode : '');
  const [kategori, setKategori] = useState(initial ? initial.kategori : KATEGORI_PEKERJAAN[0]);
  const [nama, setNama] = useState(initial ? initial.nama : '');
  const [satuan, setSatuan] = useState(initial ? initial.satuan : 'm2');
  const [komponen, setKomponen] = useState(initial && initial.komponen && initial.komponen.length ? initial.komponen.slice() : [{ priceId: priceData[0] ? priceData[0].id : '', koefisien: 0 }]);

  const updateKomponen = (idx, patch) => setKomponen(komponen.map((k, i) => (i === idx ? { ...k, ...patch } : k)));
  const addKomponen = () => setKomponen([...komponen, { priceId: priceData[0] ? priceData[0].id : '', koefisien: 0 }]);
  const removeKomponen = (idx) => setKomponen(komponen.filter((_, i) => i !== idx));

  const totalHarga = komponen.reduce((sum, k) => {
    const p = priceData.find((x) => x.id === k.priceId);
    return sum + (Number(k.koefisien) || 0) * (p ? p.harga : 0);
  }, 0);

  const submit = (e) => {
    e.preventDefault();
    if (!nama.trim() || !satuan.trim()) return;
    const cleanKomponen = komponen.filter((k) => k.priceId).map((k) => ({ priceId: k.priceId, koefisien: Number(k.koefisien) || 0 }));
    onSave({ kode: kode.trim(), kategori, nama: nama.trim(), satuan: satuan.trim(), komponen: cleanKomponen });
  };

  const bahanList = priceData.filter((p) => p.kategori === 'bahan');
  const upahList = priceData.filter((p) => p.kategori === 'upah');
  const alatList = priceData.filter((p) => p.kategori === 'alat');

  return (
    <Modal title={initial ? 'Edit Item AHSP' : 'Tambah Item AHSP'} onClose={onClose} wide>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="rab-label">Kode</label>
            <input className="rab-input" value={kode} onChange={(e) => setKode(e.target.value)} placeholder="Contoh: DD-04" />
          </div>
          <div>
            <label className="rab-label">Satuan</label>
            <input className="rab-input" value={satuan} onChange={(e) => setSatuan(e.target.value)} placeholder="m2, m3, unit, dst" />
          </div>
        </div>
        <div>
          <label className="rab-label">Kategori</label>
          <select className="rab-select" value={kategori} onChange={(e) => setKategori(e.target.value)}>
            {KATEGORI_PEKERJAAN.map((k) => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>
        <div>
          <label className="rab-label">Uraian Pekerjaan</label>
          <input className="rab-input" value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Contoh: Pasangan dinding bata ringan" autoFocus />
        </div>

        <div className="pt-3 border-t" style={{ borderColor: 'var(--line)' }}>
          <div className="flex items-center justify-between mb-2">
            <label className="rab-label" style={{ marginBottom: 0 }}>Komponen (Bahan / Upah / Alat)</label>
            <button type="button" onClick={addKomponen} className="rab-btn-ghost" style={{ padding: '4px 10px', fontSize: '12px' }}><Plus size={13} />Komponen</button>
          </div>
          <div className="flex flex-col gap-2">
            {komponen.map((k, idx) => {
              const p = priceData.find((x) => x.id === k.priceId);
              const subtotal = (Number(k.koefisien) || 0) * (p ? p.harga : 0);
              return (
                <div key={idx} className="flex items-center gap-2">
                  <select className="rab-select" style={{ flex: 2 }} value={k.priceId} onChange={(e) => updateKomponen(idx, { priceId: e.target.value })}>
                    <optgroup label="Bahan">{bahanList.map((p2) => <option key={p2.id} value={p2.id}>{p2.nama} ({p2.satuan})</option>)}</optgroup>
                    <optgroup label="Upah">{upahList.map((p2) => <option key={p2.id} value={p2.id}>{p2.nama} ({p2.satuan})</option>)}</optgroup>
                    <optgroup label="Alat">{alatList.map((p2) => <option key={p2.id} value={p2.id}>{p2.nama} ({p2.satuan})</option>)}</optgroup>
                  </select>
                  <input type="number" step="0.0001" value={k.koefisien} onChange={(e) => updateKomponen(idx, { koefisien: e.target.value })} className="rab-input" style={{ flex: 1, textAlign: 'right' }} placeholder="Koef." />
                  <span className="rab-mono text-xs text-right" style={{ color: 'var(--muted)', width: '92px', flexShrink: 0 }}>{formatRupiah(subtotal)}</span>
                  <button type="button" onClick={() => removeKomponen(idx)} className="rab-icon-btn danger" aria-label="Hapus komponen"><X size={14} /></button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-between items-center p-3 rounded-md" style={{ backgroundColor: 'var(--rust-soft)' }}>
          <span className="text-sm font-medium" style={{ color: 'var(--ink)' }}>Harga Satuan Pekerjaan</span>
          <span className="rab-mono font-semibold" style={{ color: 'var(--rust)' }}>{formatRupiah(totalHarga)}</span>
        </div>

        <div className="flex justify-end gap-2 mt-1">
          <button type="button" onClick={onClose} className="rab-btn-ghost">Batal</button>
          <button type="submit" className="rab-btn-primary">Simpan</button>
        </div>
      </form>
    </Modal>
  );
}

// ============================================================
// AHSP MANAGER
// ============================================================
function AHSPManager({ ahspData, priceData, projects, onAdd, onUpdate, onDelete, onDuplicate }) {
  const [search, setSearch] = useState('');
  const [kategoriFilter, setKategoriFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [blockedMsg, setBlockedMsg] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const filtered = ahspData.filter((a) => {
    const q = search.toLowerCase();
    const matchSearch = !q || a.nama.toLowerCase().includes(q) || (a.kode || '').toLowerCase().includes(q);
    const matchKategori = !kategoriFilter || a.kategori === kategoriFilter;
    return matchSearch && matchKategori;
  });

  const handleSave = (data) => {
    if (editing) onUpdate(editing.id, data);
    else onAdd(data);
    setShowForm(false);
    setEditing(null);
  };

  const usageCount = (ahspId) => projects.reduce((count, proj) => count + (proj.items || []).filter((it) => it.ahspId === ahspId).length, 0);

  const requestDelete = (id) => {
    const used = usageCount(id);
    if (used > 0) { setBlockedMsg(`Item ini dipakai di ${used} item proyek. Hapus dulu dari proyek terkait sebelum menghapus dari database.`); return; }
    setDeleteId(id);
  };
  const handleDelete = () => { onDelete(deleteId); setDeleteId(null); };

  return (
    <div className="max-w-5xl mx-auto px-6 md:px-10 py-8">
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--ink)' }}>Database AHSP</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Analisa Harga Satuan Pekerjaan — susunan bahan, upah, dan alat untuk setiap jenis pekerjaan. Klik baris untuk lihat rincian.</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="rab-btn-accent" type="button"><Plus size={16} />Tambah Item</button>
      </div>

      <div className="flex flex-col gap-3 mb-4 sm:flex-row">
        <div className="relative flex-1">
          <Search size={15} style={{ position: 'absolute', left: 10, top: 11, color: 'var(--muted)' }} />
          <input className="rab-input" style={{ paddingLeft: 32 }} placeholder="Cari kode atau nama pekerjaan..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="rab-select" style={{ maxWidth: '240px' }} value={kategoriFilter} onChange={(e) => setKategoriFilter(e.target.value)}>
          <option value="">Semua Kategori</option>
          {KATEGORI_PEKERJAAN.map((k) => <option key={k} value={k}>{k}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Calculator size={40} />} title="Tidak ditemukan" description="Coba kata kunci lain, atau tambahkan item AHSP baru." />
      ) : (
        <div className="rab-card overflow-x-auto">
          <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr className="text-left border-b" style={{ borderColor: 'var(--line)' }}>
                <th className="px-2 py-2.5" style={{ width: 32 }} />
                <th className="px-3 py-2.5 font-medium" style={{ color: 'var(--muted)' }}>Kode</th>
                <th className="px-3 py-2.5 font-medium" style={{ color: 'var(--muted)' }}>Uraian Pekerjaan</th>
                <th className="px-3 py-2.5 font-medium" style={{ color: 'var(--muted)' }}>Kategori</th>
                <th className="px-3 py-2.5 font-medium" style={{ color: 'var(--muted)' }}>Satuan</th>
                <th className="px-3 py-2.5 font-medium text-right" style={{ color: 'var(--muted)' }}>Harga Satuan</th>
                <th className="px-3 py-2.5 font-medium text-right" style={{ color: 'var(--muted)' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => {
                const isExpanded = expandedId === a.id;
                return (
                  <React.Fragment key={a.id}>
                    <tr className="rab-row border-b" style={{ borderColor: 'var(--line)' }}>
                      <td className="px-2 py-2.5">
                        <button onClick={() => setExpandedId(isExpanded ? null : a.id)} className="rab-icon-btn" type="button" aria-label="Lihat rincian">
                          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </button>
                      </td>
                      <td className="px-3 py-2.5 rab-mono text-xs" style={{ color: 'var(--muted)' }}>{a.kode}</td>
                      <td className="px-3 py-2.5" style={{ color: 'var(--charcoal)' }}>{a.nama}</td>
                      <td className="px-3 py-2.5 text-xs" style={{ color: 'var(--muted)' }}>{a.kategori}</td>
                      <td className="px-3 py-2.5" style={{ color: 'var(--muted)' }}>{a.satuan}</td>
                      <td className="px-3 py-2.5 text-right rab-mono font-medium">{formatRupiah(hitungHargaSatuan(a, priceData))}</td>
                      <td className="px-3 py-2.5">
                        <div className="flex justify-end gap-1">
                          <button onClick={() => onDuplicate(a)} className="rab-icon-btn" type="button" aria-label="Duplikat"><Copy size={14} /></button>
                          <button onClick={() => { setEditing(a); setShowForm(true); }} className="rab-icon-btn" type="button" aria-label="Edit"><Pencil size={14} /></button>
                          <button onClick={() => requestDelete(a.id)} className="rab-icon-btn danger" type="button" aria-label="Hapus"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="border-b" style={{ borderColor: 'var(--line)' }}>
                        <td colSpan={7} className="px-4 py-3" style={{ backgroundColor: 'var(--paper)' }}>
                          <p className="text-xs font-medium mb-2" style={{ color: 'var(--muted)' }}>Rincian Komponen</p>
                          <div className="flex flex-col gap-1">
                            {(a.komponen || []).map((k, i) => {
                              const p = priceData.find((x) => x.id === k.priceId);
                              const subtotal = (Number(k.koefisien) || 0) * (p ? p.harga : 0);
                              return (
                                <div key={i} className="flex items-center justify-between text-xs" style={{ maxWidth: '560px' }}>
                                  <span style={{ color: 'var(--charcoal)' }}>{p ? p.nama : '(item harga sudah terhapus)'}</span>
                                  <span className="rab-mono" style={{ color: 'var(--muted)' }}>{formatAngka(k.koefisien)} x {formatRupiah(p ? p.harga : 0)} = {formatRupiah(subtotal)}</span>
                                </div>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showForm && <AHSPFormModal initial={editing} priceData={priceData} onSave={handleSave} onClose={() => { setShowForm(false); setEditing(null); }} />}
      {deleteId && <ConfirmDialog title="Hapus item AHSP?" message="Item ini akan dihapus dari database secara permanen." danger onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />}
      {blockedMsg && <ConfirmDialog title="Tidak bisa dihapus" message={blockedMsg} onConfirm={() => setBlockedMsg('')} confirmLabel="Mengerti" hideCancel />}
    </div>
  );
}

// ============================================================
// PRICE FORM MODAL
// ============================================================
function PriceFormModal({ initial, onSave, onClose }) {
  const [kategori, setKategori] = useState(initial ? initial.kategori : 'bahan');
  const [nama, setNama] = useState(initial ? initial.nama : '');
  const [satuan, setSatuan] = useState(initial ? initial.satuan : '');
  const [harga, setHarga] = useState(initial ? initial.harga : '');

  const submit = (e) => {
    e.preventDefault();
    if (!nama.trim() || !satuan.trim()) return;
    onSave({ kategori, nama: nama.trim(), satuan: satuan.trim(), harga: Number(harga) || 0 });
  };

  return (
    <Modal title={initial ? 'Edit Item Harga' : 'Tambah Item Harga'} onClose={onClose}>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <div>
          <label className="rab-label">Kategori</label>
          <select className="rab-select" value={kategori} onChange={(e) => setKategori(e.target.value)}>
            <option value="bahan">Bahan</option>
            <option value="upah">Upah</option>
            <option value="alat">Alat</option>
          </select>
        </div>
        <div>
          <label className="rab-label">Nama Item</label>
          <input className="rab-input" value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Contoh: Bata Ringan (Hebel)" autoFocus />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="rab-label">Satuan</label>
            <input className="rab-input" value={satuan} onChange={(e) => setSatuan(e.target.value)} placeholder="kg, m3, OH, dst" />
          </div>
          <div>
            <label className="rab-label">Harga (Rp)</label>
            <input type="number" className="rab-input" value={harga} onChange={(e) => setHarga(e.target.value)} placeholder="0" />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-2">
          <button type="button" onClick={onClose} className="rab-btn-ghost">Batal</button>
          <button type="submit" className="rab-btn-primary">Simpan</button>
        </div>
      </form>
    </Modal>
  );
}

// ============================================================
// PRICE MANAGER
// ============================================================
function PriceManager({ priceData, ahspData, onAdd, onUpdate, onDelete }) {
  const [search, setSearch] = useState('');
  const [katFilter, setKatFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [blockedMsg, setBlockedMsg] = useState('');

  const filtered = priceData.filter((p) => {
    const matchSearch = !search || p.nama.toLowerCase().includes(search.toLowerCase());
    const matchKat = !katFilter || p.kategori === katFilter;
    return matchSearch && matchKat;
  });

  const handleSave = (data) => {
    if (editing) onUpdate(editing.id, data);
    else onAdd(data);
    setShowForm(false);
    setEditing(null);
  };

  const usageCount = (priceId) => ahspData.reduce((count, a) => count + (a.komponen || []).filter((k) => k.priceId === priceId).length, 0);

  const requestDelete = (id) => {
    const used = usageCount(id);
    if (used > 0) { setBlockedMsg(`Item ini dipakai di ${used} komponen AHSP. Ubah komponen tersebut dulu sebelum menghapus item harga ini.`); return; }
    setDeleteId(id);
  };
  const handleDelete = () => { onDelete(deleteId); setDeleteId(null); };

  return (
    <div className="max-w-5xl mx-auto px-6 md:px-10 py-8">
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--ink)' }}>Database Harga Satuan</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Harga bahan, upah, dan alat yang menjadi dasar perhitungan AHSP.</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="rab-btn-accent" type="button"><Plus size={16} />Tambah Item</button>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {['', 'bahan', 'upah', 'alat'].map((k) => {
          const isActive = katFilter === k;
          return (
            <button key={k || 'all'} onClick={() => setKatFilter(k)} type="button" className="text-sm" style={{ padding: '6px 14px', borderRadius: '6px', fontWeight: 500, cursor: 'pointer', border: `1px solid ${isActive ? 'var(--ink)' : 'var(--line)'}`, color: isActive ? '#fff' : 'var(--muted)', backgroundColor: isActive ? 'var(--ink)' : 'transparent' }}>
              {k ? KAT_LABEL[k] : 'Semua'}
            </button>
          );
        })}
      </div>

      <div className="relative mb-4">
        <Search size={15} style={{ position: 'absolute', left: 10, top: 11, color: 'var(--muted)' }} />
        <input className="rab-input" style={{ paddingLeft: 32, maxWidth: '360px' }} placeholder="Cari item harga..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Coins size={40} />} title="Tidak ditemukan" description="Coba kata kunci lain, atau tambahkan item harga baru." />
      ) : (
        <div className="rab-card overflow-x-auto">
          <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr className="text-left border-b" style={{ borderColor: 'var(--line)' }}>
                <th className="px-3 py-2.5 font-medium" style={{ color: 'var(--muted)' }}>Nama</th>
                <th className="px-3 py-2.5 font-medium" style={{ color: 'var(--muted)' }}>Kategori</th>
                <th className="px-3 py-2.5 font-medium" style={{ color: 'var(--muted)' }}>Satuan</th>
                <th className="px-3 py-2.5 font-medium text-right" style={{ color: 'var(--muted)' }}>Harga</th>
                <th className="px-3 py-2.5 font-medium text-right" style={{ color: 'var(--muted)' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="rab-row border-b" style={{ borderColor: 'var(--line)' }}>
                  <td className="px-3 py-2.5" style={{ color: 'var(--charcoal)' }}>{p.nama}</td>
                  <td className="px-3 py-2.5 text-xs" style={{ color: 'var(--muted)' }}>{KAT_LABEL[p.kategori]}</td>
                  <td className="px-3 py-2.5" style={{ color: 'var(--muted)' }}>{p.satuan}</td>
                  <td className="px-3 py-2.5 text-right rab-mono font-medium">{formatRupiah(p.harga)}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => { setEditing(p); setShowForm(true); }} className="rab-icon-btn" type="button" aria-label="Edit"><Pencil size={14} /></button>
                      <button onClick={() => requestDelete(p.id)} className="rab-icon-btn danger" type="button" aria-label="Hapus"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && <PriceFormModal initial={editing} onSave={handleSave} onClose={() => { setShowForm(false); setEditing(null); }} />}
      {deleteId && <ConfirmDialog title="Hapus item harga?" message="Item ini akan dihapus dari database secara permanen." danger onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />}
      {blockedMsg && <ConfirmDialog title="Tidak bisa dihapus" message={blockedMsg} onConfirm={() => setBlockedMsg('')} confirmLabel="Mengerti" hideCancel />}
    </div>
  );
}

// ============================================================
// SETUP / ERROR SCREENS
// ============================================================
function CenteredNotice({ tone, title, children }) {
  return (
    <div className="rab-app flex items-center justify-center p-6" style={{ minHeight: '100vh', backgroundColor: 'var(--paper)', color: 'var(--charcoal)' }}>
      <div className="rab-card p-8 text-center" style={{ maxWidth: '480px' }}>
        <div className="flex items-center justify-center rounded mx-auto mb-4" style={{ width: 48, height: 48, backgroundColor: tone === 'error' ? 'var(--rust)' : 'var(--ink)', color: '#fff' }}>
          {tone === 'error' ? <AlertTriangle size={24} /> : <Ruler size={24} />}
        </div>
        <h1 className="text-xl font-semibold mb-2" style={{ color: 'var(--ink)' }}>{title}</h1>
        <div className="text-sm" style={{ color: 'var(--muted)' }}>{children}</div>
      </div>
    </div>
  );
}

// ============================================================
// APP ROOT
// ============================================================
export default function App() {
  const [activeTab, setActiveTab] = useState('proyek');
  const [projects, setProjects] = useState([]);
  const [ahspData, setAhspData] = useState([]);
  const [priceData, setPriceData] = useState([]);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const notify = (msg) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2400);
  };

  const fetchAll = async () => {
    const [priceRes, ahspRes, projectRes] = await Promise.all([
      supabase.from('price_items').select('*').order('kategori').order('nama'),
      supabase.from('ahsp_items').select('*').order('kode'),
      supabase.from('projects').select('*').order('created_at', { ascending: false }),
    ]);
    if (priceRes.error) throw priceRes.error;
    if (ahspRes.error) throw ahspRes.error;
    if (projectRes.error) throw projectRes.error;
    return {
      prices: priceRes.data || [],
      ahsp: (ahspRes.data || []).map((r) => ({ ...r, komponen: r.komponen || [] })),
      projs: (projectRes.data || []).map((r) => ({ ...r, items: r.items || [] })),
    };
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!supabaseConfigured) { setLoading(false); return; }
      try {
        let { prices, ahsp, projs } = await fetchAll();
        if (!cancelled && prices.length === 0 && ahsp.length === 0 && projs.length === 0) {
          await supabase.from('price_items').insert(SAMPLE_PRICES);
          await supabase.from('ahsp_items').insert(SAMPLE_AHSP);
          await supabase.from('projects').insert(buildSampleProjects());
          ({ prices, ahsp, projs } = await fetchAll());
        }
        if (cancelled) return;
        setPriceData(prices);
        setAhspData(ahsp);
        setProjects(projs);
        setLoading(false);
      } catch (err) {
        if (cancelled) return;
        setLoadError((err && err.message) || String(err));
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // ---- Price items CRUD ----
  const addPriceItem = async (data) => {
    const newItem = { id: generateId('h'), ...data };
    setPriceData((prev) => [...prev, newItem]);
    const { error } = await supabase.from('price_items').insert([newItem]);
    notify(error ? `Gagal menyimpan: ${error.message}` : 'Item harga disimpan');
  };
  const updatePriceItem = async (id, patch) => {
    setPriceData((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
    const { error } = await supabase.from('price_items').update(patch).eq('id', id);
    notify(error ? `Gagal menyimpan: ${error.message}` : 'Item harga disimpan');
  };
  const deletePriceItem = async (id) => {
    setPriceData((prev) => prev.filter((p) => p.id !== id));
    const { error } = await supabase.from('price_items').delete().eq('id', id);
    notify(error ? `Gagal menghapus: ${error.message}` : 'Item harga dihapus');
  };

  // ---- AHSP items CRUD ----
  const addAhspItem = async (data) => {
    const newItem = { id: generateId('p'), ...data };
    setAhspData((prev) => [...prev, newItem]);
    const { error } = await supabase.from('ahsp_items').insert([newItem]);
    notify(error ? `Gagal menyimpan: ${error.message}` : 'Item AHSP disimpan');
  };
  const updateAhspItem = async (id, patch) => {
    setAhspData((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
    const { error } = await supabase.from('ahsp_items').update(patch).eq('id', id);
    notify(error ? `Gagal menyimpan: ${error.message}` : 'Item AHSP disimpan');
  };
  const deleteAhspItem = async (id) => {
    setAhspData((prev) => prev.filter((a) => a.id !== id));
    const { error } = await supabase.from('ahsp_items').delete().eq('id', id);
    notify(error ? `Gagal menghapus: ${error.message}` : 'Item AHSP dihapus');
  };
  const duplicateAhspItem = async (item) => {
    const copy = { id: generateId('p'), kode: item.kode ? `${item.kode}-2` : '', kategori: item.kategori, nama: `${item.nama} (Salinan)`, satuan: item.satuan, komponen: (item.komponen || []).map((k) => ({ ...k })) };
    setAhspData((prev) => [...prev, copy]);
    const { error } = await supabase.from('ahsp_items').insert([copy]);
    notify(error ? `Gagal menduplikat: ${error.message}` : 'Item AHSP diduplikat, siap disesuaikan');
  };

  // ---- Projects CRUD ----
  const addProject = async (data) => {
    const newProject = { id: generateId('proj'), buk: 10, ppn: 11, items: [], ...data };
    setProjects((prev) => [newProject, ...prev]);
    const { error } = await supabase.from('projects').insert([newProject]);
    if (error) notify(`Gagal menyimpan: ${error.message}`);
    return newProject;
  };
  const updateProjectRow = async (id, patch) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
    const { error } = await supabase.from('projects').update(patch).eq('id', id);
    if (error) notify(`Gagal menyimpan perubahan: ${error.message}`);
  };
  const deleteProjectRow = async (id) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (activeProjectId === id) setActiveProjectId(null);
    const { error } = await supabase.from('projects').delete().eq('id', id);
    notify(error ? `Gagal menghapus: ${error.message}` : 'Proyek dihapus');
  };
  const duplicateProject = async (project) => {
    const copy = { id: generateId('proj'), nama: `${project.nama} (Salinan)`, lokasi: project.lokasi, tanggal: project.tanggal, buk: project.buk, ppn: project.ppn, items: project.items.map((it) => ({ ...it, id: generateId('it') })) };
    setProjects((prev) => [copy, ...prev]);
    const { error } = await supabase.from('projects').insert([copy]);
    notify(error ? `Gagal menduplikat: ${error.message}` : 'Proyek diduplikat');
  };

  const activeProject = projects.find((p) => p.id === activeProjectId);

  if (!supabaseConfigured) {
    return (
      <CenteredNotice tone="setup" title="Supabase belum dikonfigurasi">
        <p className="mb-2">
          Isi file <code className="rab-mono" style={{ background: 'var(--paper)', padding: '1px 5px', borderRadius: 4 }}>.env</code> dengan URL dan anon key project Supabase kamu (contoh ada di <code className="rab-mono" style={{ background: 'var(--paper)', padding: '1px 5px', borderRadius: 4 }}>.env.example</code>), lalu jalankan ulang <code className="rab-mono" style={{ background: 'var(--paper)', padding: '1px 5px', borderRadius: 4 }}>npm run dev</code>.
        </p>
        <p>Lihat README.md untuk langkah lengkapnya.</p>
      </CenteredNotice>
    );
  }

  if (loadError) {
    return (
      <CenteredNotice tone="error" title="Gagal terhubung ke database">
        <p className="mb-2">{loadError}</p>
        <p>Periksa: skema SQL sudah dijalankan di Supabase, URL &amp; anon key di .env benar, dan koneksi internet aktif.</p>
      </CenteredNotice>
    );
  }

  return (
    <div className="rab-app" style={{ backgroundColor: 'var(--paper)', minHeight: '100vh', color: 'var(--charcoal)' }}>
      {loading ? (
        <div className="flex items-center justify-center" style={{ minHeight: '60vh', color: 'var(--muted)' }}>Memuat data...</div>
      ) : (
        <>
          <div className="no-print rab-grid-header border-b sticky top-0 z-10" style={{ borderColor: 'var(--line)', backgroundColor: 'var(--surface)' }}>
            <div className="max-w-5xl mx-auto px-6 md:px-10 flex items-center justify-between flex-wrap">
              <div className="flex items-center gap-2 py-3">
                <div className="flex items-center justify-center rounded" style={{ width: 28, height: 28, backgroundColor: 'var(--ink)', color: '#fff' }}><Ruler size={16} /></div>
                <span className="font-semibold text-sm" style={{ color: 'var(--ink)' }}>Sistem RAB</span>
              </div>
              <nav className="flex gap-5">
                <button onClick={() => { setActiveTab('proyek'); setActiveProjectId(null); }} className={`rab-nav-tab${activeTab === 'proyek' ? ' active' : ''}`} type="button">Proyek</button>
                <button onClick={() => setActiveTab('ahsp')} className={`rab-nav-tab${activeTab === 'ahsp' ? ' active' : ''}`} type="button">AHSP</button>
                <button onClick={() => setActiveTab('harga')} className={`rab-nav-tab${activeTab === 'harga' ? ' active' : ''}`} type="button">Harga</button>
              </nav>
            </div>
          </div>

          {activeTab === 'proyek' && (
            activeProject ? (
              <ProjectDetail
                project={activeProject}
                ahspData={ahspData}
                priceData={priceData}
                onBack={() => setActiveProjectId(null)}
                onUpdate={(patch) => updateProjectRow(activeProject.id, patch)}
                notify={notify}
              />
            ) : (
              <Dashboard
                projects={projects}
                ahspData={ahspData}
                priceData={priceData}
                onOpenProject={setActiveProjectId}
                onAdd={addProject}
                onDelete={deleteProjectRow}
                onDuplicate={duplicateProject}
              />
            )
          )}
          {activeTab === 'ahsp' && (
            <AHSPManager
              ahspData={ahspData}
              priceData={priceData}
              projects={projects}
              onAdd={addAhspItem}
              onUpdate={updateAhspItem}
              onDelete={deleteAhspItem}
              onDuplicate={duplicateAhspItem}
            />
          )}
          {activeTab === 'harga' && (
            <PriceManager
              priceData={priceData}
              ahspData={ahspData}
              onAdd={addPriceItem}
              onUpdate={updatePriceItem}
              onDelete={deletePriceItem}
            />
          )}
        </>
      )}
      <Toast message={toast} />
    </div>
  );
}
