import fs from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), 'public', 'files', 'PTT_CV.pdf'); // Path to your file

        // Check if the file exists
        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }

        // Read the file and create a response
        const fileBuffer = fs.readFileSync(filePath);
        const response = new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="CV.pdf"',
            },
        });

        return response;
    } catch (error) {
        console.error('Error serving the PDF:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
