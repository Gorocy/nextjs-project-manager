import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Cache dla wyników zapytań
const cache = new Map();
const CACHE_TIME = 5000; // 5 sekund

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('userId');
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Sprawdź cache
    const cacheKey = `project-${params.id}-${userId}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      const { data, timestamp } = cachedData;
      if (Date.now() - timestamp < CACHE_TIME) {
        return NextResponse.json(data);
      }
      cache.delete(cacheKey);
    }

    const project = await prisma.project.findFirst({
      where: {
        id: parseInt(params.id),
        ownerId: parseInt(userId),
      },
      include: {
        tasks: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Zapisz w cache
    cache.set(cacheKey, {
      data: project,
      timestamp: Date.now()
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Project fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project details' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('userId');
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Sprawdź, czy projekt istnieje i należy do użytkownika
    const project = await prisma.project.findFirst({
      where: {
        id: parseInt(params.id),
        ownerId: parseInt(userId),
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Usuń wszystkie zadania projektu i sam projekt
    await prisma.$transaction([
      prisma.task.deleteMany({
        where: {
          projectId: parseInt(params.id),
        },
      }),
      prisma.project.delete({
        where: {
          id: parseInt(params.id),
        },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Project deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
} 