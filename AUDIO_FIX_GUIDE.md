# FIX AUDIO ISSUES - STREAM KHÔNG CÓ TIẾNG

## 🔍 **Vấn đề đã phát hiện:**

1. **Component `LiveVideo` chỉ xử lý video track** - Không có code để handle audio track
2. **Logic mute/unmute bị sai** - Set volume về 0 khi unmute
3. **Thiếu user interaction** - Browser policy có thể block autoplay audio
4. **Thiếu logging** - Không biết audio track có được attach hay không

## ✅ **Các fix đã thực hiện:**

### 1. Thêm Audio Track Support
```tsx
// Thêm import RemoteAudioTrack
import {
  Participant,
  RemoteTrackPublication,
  RemoteVideoTrack,
  RemoteAudioTrack,  // ← THÊM MỚI
  Track,
} from "livekit-client";

// Thêm audio tracks
const audioTracks = useTracks([Track.Source.Microphone]).filter(
  (track) => track.participant.identity === participant.identity
);
```

### 2. Handle Audio Track Attachment
```tsx
// Thêm useEffect để attach audio track
useEffect(() => {
  const pub = audioTracks[0]?.publication as RemoteTrackPublication | undefined;
  const track = pub?.track;

  if (videoRef.current && track && track.kind === "audio") {
    track.attach(videoRef.current);
    console.log("Audio track attached"); // ← LOGGING
  }

  return () => {
    if (track && videoRef.current) {
      track.detach(videoRef.current);
      console.log("Audio track detached"); // ← LOGGING
    }
  };
}, [audioTracks]);
```

### 3. Sửa Logic Mute/Unmute
```tsx
// TRƯỚC (SAI):
const handleToggleMute = () => {
  setMuted((prev) => !prev);
  setVolume((prev) => (prev === 0 ? 100 : 0)); // ← SAI LOGIC
};

// SAU (ĐÚNG):
const handleToggleMute = () => {
  setMuted((prev) => !prev);
  // Nếu đang muted và volume = 0, thì set volume về 100 khi unmute
  if (muted && volume === 0) {
    setVolume(100);
  }
};
```

### 4. Thêm User Interaction Support
```tsx
<video
  ref={videoRef}
  autoPlay
  playsInline
  muted={muted}
  controls={false}
  onClick={() => {
    // Handle user interaction để enable audio playback
    if (videoRef.current) {
      videoRef.current.play().catch(console.error);
    }
  }}
/>
```

### 5. Thêm Auto-play với Error Handling
```tsx
// Ensure video plays when tracks are available
useEffect(() => {
  if (videoRef.current && (videoTracks.length > 0 || audioTracks.length > 0)) {
    videoRef.current.play().catch((error) => {
      console.warn("Autoplay prevented:", error);
      // Browser might require user interaction first
    });
  }
}, [videoTracks, audioTracks]);
```

## 🧪 **Cách test:**

1. **Mở Developer Console** - Xem log "Audio track attached"
2. **Click vào video player** - Trigger user interaction
3. **Check volume controls** - Test mute/unmute
4. **Test với OBS** - Đảm bảo OBS đang stream cả video và audio

## 📋 **Checklist troubleshooting:**

- [ ] **OBS Settings**: Đảm bảo OBS capture cả desktop audio và microphone
- [ ] **Browser Policy**: Click vào video để enable autoplay
- [ ] **Volume Level**: Kiểm tra volume không bị mute (0%)
- [ ] **Audio Track**: Xem console log có "Audio track attached" không
- [ ] **LiveKit Room**: Đảm bảo audio permission được allow

## 🔧 **Các file đã sửa:**

1. **`components/stream-player/live-video.tsx`**:
   - Thêm audio track support
   - Sửa mute/unmute logic  
   - Thêm user interaction handling
   - Thêm logging và error handling

## 🚨 **Lưu ý quan trọng:**

1. **Browser Autoplay Policy**: Hầu hết browser block autoplay audio cho đến khi user có interaction
2. **OBS Configuration**: Phải config OBS để stream audio, không chỉ video
3. **Audio Permissions**: Browser cần được cấp quyền audio
4. **Network Issues**: Kiểm tra connection có stable không

## 🎯 **Kết quả mong đợi:**

Sau khi fix, stream sẽ có cả video và audio. Nếu vẫn không có tiếng:
1. Check console log
2. Click vào video player  
3. Kiểm tra volume controls
4. Restart OBS và refresh browser
