import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Path menuju file JSON di folder public
    const jsonPath = path.join(process.cwd(), 'public', 'saham_target.json');
    
    // Cek apakah file ada
    if (!fs.existsSync(jsonPath)) {
      return NextResponse.json({ error: "File saham_target.json tidak ditemukan di folder public" }, { status: 404 });
    }

    // Baca data
    const rawData = fs.readFileSync(jsonPath, 'utf-8');
    const sahamList = JSON.parse(rawData);

    // Kirim data apa adanya ke frontend
    // Pastikan formatnya adalah Array [ {...}, {...} ]
    return NextResponse.json(sahamList);

  } catch (error: any) {
    console.error("Gagal membaca JSON:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}