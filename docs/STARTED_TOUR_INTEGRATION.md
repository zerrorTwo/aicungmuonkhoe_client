# Started Tour Integration - Frontend

## Tổng quan

Frontend đã được cập nhật để sử dụng API thay vì localStorage/sessionStorage để quản lý trạng thái tour hướng dẫn.

## Files đã tạo/cập nhật

### 1. API Layer

- **`src/store/api/startedTourApi.ts`** - RTK Query API endpoints
  - `useCreateStartedTourMutation` - Tạo/lưu tour completion
  - `useGetStartedTourByFeatureQuery` - Lấy trạng thái tour
  - `useLazyGetStartedTourByFeatureQuery` - Lazy query version

### 2. Enums

- **`src/enum/start-tour.ts`** - Định nghĩa các feature modules
  ```typescript
  export enum StartTourModule {
    HOME = "HOME",
    HEALTH_TRACKING = "HEALTH_TRACKING",
    HEALTH_CONSULTING = "HEALTH_CONSULTATION",
    MEAL_PLANNER = "MEAL_PLANNER",
    HEALTH_HISTORY = "HEALTH_HISTORY",
    YOUR_GOAL = "YOUR_GOAL",
  }
  ```

### 3. Hooks

- **`src/hooks/useTour.ts`** - Custom hook để quản lý tour
  - Tự động kiểm tra trạng thái tour qua API
  - Cung cấp methods để start/finish/reset tour
  - Trả về loading state và completion status

### 4. Pages Updated

- **`src/pages/Home.tsx`** - Đã cập nhật để sử dụng API

## Cách sử dụng

### Option 1: Sử dụng Hook `useTour`

```typescript
import { useTour } from '@/hooks/useTour';
import { StartTourModule } from '@/enum/start-tour';
import StartedTour from '@/components/tour/StartedTour';

const MyPage = () => {
  const {
    runTour,
    handleTourFinish,
    startTour,
    resetTour,
    isCompleted,
    isLoading,
  } = useTour(StartTourModule.HEALTH_TRACKING);

  return (
    <div>
      {/* Your page content */}

      {/* Tour component */}
      <StartedTour run={runTour} onFinish={handleTourFinish} />

      {/* Optional: Manual tour trigger */}
      <button onClick={startTour}>Start Tour</button>
    </div>
  );
};
```

### Option 2: Sử dụng trực tiếp RTK Query hooks

```typescript
import {
  useGetStartedTourByFeatureQuery,
  useCreateStartedTourMutation,
} from '@/store/api/startedTourApi';
import { StartTourModule } from '@/enum/start-tour';

const MyPage = () => {
  const [runTour, setRunTour] = useState(false);

  // Check tour status
  const { data: tourData, isLoading } = useGetStartedTourByFeatureQuery({
    FEATURE: StartTourModule.HEALTH_TRACKING,
  });

  // Create tour completion
  const [createStartedTour] = useCreateStartedTourMutation();

  useEffect(() => {
    // Start tour if not completed
    if (!isLoading && !tourData?.data) {
      setRunTour(true);
    }
  }, [tourData, isLoading]);

  const handleTourFinish = async () => {
    setRunTour(false);
    try {
      await createStartedTour({
        FEATURE: StartTourModule.HEALTH_TRACKING,
      }).unwrap();
    } catch (error) {
      console.error('Failed to save tour:', error);
    }
  };

  return (
    <div>
      <StartedTour run={runTour} onFinish={handleTourFinish} />
    </div>
  );
};
```

## Features được hỗ trợ

Các module tour có sẵn (từ `StartTourModule` enum):

- `HOME` - Tour trang chủ
- `HEALTH_TRACKING` - Tour theo dõi sức khỏe
- `HEALTH_CONSULTING` - Tour tư vấn sức khỏe (HEALTH_CONSULTATION trên BE)
- `MEAL_PLANNER` - Tour lập kế hoạch bữa ăn
- `HEALTH_HISTORY` - Tour lịch sử sức khỏe
- `YOUR_GOAL` - Tour mục tiêu cá nhân

## API Response Format

### Get Started Tour

```typescript
{
  data: {
    ID: number;
    USER_ID: number;
    FEATURE: string;
    IS_COMPLETED: number;
    CREATED_AT?: string;
    UPDATED_AT?: string;
  } | null,
  message?: string;
  status?: number;
}
```

### Create Started Tour

```typescript
{
  data: {
    ID: number;
    USER_ID: number;
    FEATURE: string;
    IS_COMPLETED: number;
    CREATED_AT?: string;
    UPDATED_AT?: string;
  },
  message?: string;
  status?: number;
}
```

## Migration từ localStorage

### Trước (localStorage):

```typescript
const TOUR_COMPLETED_KEY = "tour_completed"
const tourCompleted = localStorage.getItem(TOUR_COMPLETED_KEY)
if (!tourCompleted) {
  setRunTour(true)
}
localStorage.setItem(TOUR_COMPLETED_KEY, "true")
```

### Sau (API):

```typescript
const { data: tourData } = useGetStartedTourByFeatureQuery({
  FEATURE: StartTourModule.HOME,
})
if (!tourData?.data) {
  setRunTour(true)
}
await createStartedTour({ FEATURE: StartTourModule.HOME }).unwrap()
```

## Lợi ích

1. **Đồng bộ cross-device**: Tour completion được lưu trên server, sync giữa các thiết bị
2. **Quản lý tập trung**: Dễ dàng theo dõi và quản lý tour completion của users
3. **Không phụ thuộc browser storage**: Không bị mất data khi clear cache
4. **Type-safe**: Sử dụng TypeScript với RTK Query
5. **Caching tự động**: RTK Query tự động cache và invalidate data

## Lưu ý

- API tự động lấy USER_ID từ JWT token
- Tour chỉ chạy khi user đã đăng nhập
- Nếu API call fail, tour vẫn có thể chạy (graceful degradation)
- Cache được quản lý tự động bởi RTK Query với tag "StartedTour"
