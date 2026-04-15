# Investigation Report: "View Details" Button Bug

## Bug Summary
The user reported that the "View Details" button in the admin dashboard is not working. Upon investigation, it was discovered that the "View Details" button/action is completely missing from the `Requests Table` in the `Admin.tsx` component.

## Root Cause Analysis
- The `Admin.tsx` file lists requests in a table (`requestsList.data.map`).
- The table structure (`TableHeader` and `TableBody`) includes columns for "Request Number", "Name", "Identity Number", "Email", "Requested Amount", "Status", and "Date".
- There is no column for "Actions" or any "View Details" button within the rows.
- Although there is a `Dialog` for adding a new request, there is no corresponding dialog or page implementation to view the full details of an existing request from the list.

## Affected Components
- **Frontend**: `dashboard/client/src/pages/Admin.tsx` (missing UI element and logic).

## Proposed Solution
1. **Add "Actions" Column**: Update the `TableHeader` to include an "Actions" (الإجراءات) column.
2. **Add "View Details" Button**: Add a button to each row in the `TableBody` that triggers a "View Details" action.
3. **Implement Details Dialog**:
   - Create a new state variable `selectedRequest` to hold the request to be viewed.
   - Create a new `Dialog` component that displays all fields of the `selectedRequest` in a read-only or editable format (depending on requirements, usually read-only for "details").
   - Populate the dialog with data from the `requests` object, which contains many fields not currently shown in the table (e.g., `phoneNumber`, `gender`, `nationality`, `fundingAmount`, etc.).
4. **Trigger Dialog**: Set `selectedRequest` and open the dialog when the "View Details" button is clicked.

## Edge Cases & Side Effects
- **Empty Data**: Ensure the dialog handles optional or null fields gracefully.
- **Mobile Responsiveness**: The table is already in an `overflow-x-auto` container, but adding another column might make it wider; the details dialog should be responsive.
- **Permissions**: Ensure only admins can trigger this (the entire page is already protected).
