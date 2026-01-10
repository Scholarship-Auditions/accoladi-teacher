export interface Degree {
  id: number;
  name: string;
}

export interface Major {
  id: number;
  name: string;
}

// Represents the main University object returned by the API
export interface University {
  id: number;
  name: string;
  city: string;
  state: string;
  country: string;
  websiteUrl: string; // Note the camelCase
  // The backend serializer now provides this clean, grouped object
  programsByDegree: Record<string, string[]>;
}


export function findDuplicateUniversities(universities: University[]) {
  const nameToIds: Record<string, number[]> = {};

  for (const uni of universities) {
    // Normalize name: lowercase and trim
    const normalizedName = uni.name.toLowerCase().trim();

    if (!nameToIds[normalizedName]) {
      nameToIds[normalizedName] = [];
    }
    nameToIds[normalizedName].push(uni.id);
  }

  // Filter to only those with duplicates
  const duplicates: Record<string, number[]> = {};
  for (const [name, ids] of Object.entries(nameToIds)) {
    if (ids.length > 1) {
      duplicates[name] = ids;
    }
  }

  return duplicates;
}


export function mergeUniversities(universities: University[]): University[] {
  const uniMap = new Map<string, University>();

  for (const uni of universities) {
    const normalizedName = uni.name.toLowerCase().trim();

    if (!uniMap.has(normalizedName)) {
      // Clone object (shallow) to avoid mutating input
      uniMap.set(normalizedName, {
        ...uni,
        programsByDegree: { ...uni.programsByDegree },
      });
    } else {
      const existing = uniMap.get(normalizedName)!;

      // Merge programsByDegree
      for (const [degree, programs] of Object.entries(uni.programsByDegree)) {
        if (!existing.programsByDegree[degree]) {
          existing.programsByDegree[degree] = [...programs];
        } else {
          // Add unique programs to existing degree array
          const existingPrograms = new Set(existing.programsByDegree[degree]);
          for (const p of programs) {
            if (!existingPrograms.has(p)) {
              existing.programsByDegree[degree].push(p);
              existingPrograms.add(p);
            }
          }
        }
      }
    }
  }

  // Convert map values to array and reassign sequential ids starting at 1
  const merged = Array.from(uniMap.values()).map((uni, index) => ({
    ...uni,
    id: index + 1,
  }));

  return merged;
}