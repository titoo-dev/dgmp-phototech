# Mobile File Upload Integration

This guide shows how to integrate your Flutter app with the Next.js server actions that support file uploads.

## Overview

Your server already supports two approaches for file uploads:

1. **FormData approach** (`/api/missions`) - Traditional multipart/form-data (compatible with web)
2. **JSON + Base64 approach** (`/api/missions/mobile`) - Mobile-optimized with base64-encoded files

## Quick Start

### 1. Add Dependencies

Add these to your `pubspec.yaml`:

```yaml
dependencies:
  dio: ^5.3.2
  image_picker: ^1.0.4
  file_picker: ^6.1.1
```

### 2. Simple Implementation

```dart
import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:image_picker/image_picker.dart';

// Pick and upload images
final ImagePicker picker = ImagePicker();
final List<XFile> images = await picker.pickMultiImage();

// Convert to base64
List<Map<String, dynamic>> photoFiles = [];
for (XFile image in images) {
  final bytes = await image.readAsBytes();
  photoFiles.add({
    'base64Data': base64Encode(bytes),
    'fileName': image.name,
    'mimeType': image.mimeType ?? 'image/jpeg',
    'size': bytes.length,
  });
}

// Send to API
final dio = Dio();
dio.options.headers['Authorization'] = 'Bearer YOUR_TOKEN';

await dio.post('https://your-api.com/api/missions', data: {
  'teamLeaderId': 'user-123',
  'startDate': DateTime.now().toIso8601String(),
  'endDate': DateTime.now().add(Duration(days: 7)).toIso8601String(),
  'location': 'Paris, France',
  'memberIds': ['member-1', 'member-2'],
  'projectsData': [
    {
      'projectId': 'proj-1',
      'notes': 'Market research',
      'marketName': 'Market A',
    }
  ],
  'photoFiles': {
    'Market A': photoFiles,
  },
});
```
