# Gym Management System (GM-HQ)

## Fixed Issues

1. Added missing enum classes imports in entity files:
  - Added imports for enum classes in the following entities:
    - Equipment.java: EquipmentCategory, EquipmentStatus
    - Invoice.java: InvoiceStatus
    - User.java: RoleType
    - Payment.java: PaymentMethod, PaymentStatus
    - Subscription.java: SubscriptionStatus
    - MembershipPlan.java: BillingCycle
    - ClassBooking.java: BookingStatus
    - ClassSchedule.java: RecurrencePattern
    - GymClass.java: ClassDifficulty, ClassCategory
    - NotificationTemplate.java: NotificationType
    - PTSession.java: SessionStatus, SessionType
    - Attendance.java: VisitType
    - Notification.java: NotificationType, NotificationPriority, NotificationStatus
    - EmailNotification.java: EmailStatus

2. Added missing ClassSchedule import to ClassBookingRepository

3. Created the missing UserPrincipal class in the security package

4. Added import for UserPrincipal in MemberController

5. Added the missing java.util.function.Function import to JwtTokenProvider

6. Fixed Lombok boolean property naming issues:
  - Changed isActive to active in:
    - Equipment.java
    - MembershipPlan.java
    - User.java
  - Changed isEmailVerified to emailVerified in User.java
  - Updated related service methods to use setActive() and setEmailVerified()

## Remaining Issues

1. DtoMapper class methods need to be implemented or corrected:
  - Missing methods like mapToPaymentDto(), mapToPTSessionDto(), mapToAttendanceDto(), etc.
  - Methods with incorrect parameters
  - Type conversion issues

2. JWT library compatibility issue with parserBuilder() method in JwtTokenProvider.java

3. Repository method naming issues (e.g., findByIsActiveTrue needs to be updated to findByActiveTrue)

4. Controller method compatibility issues (type conversions between DTOs)
