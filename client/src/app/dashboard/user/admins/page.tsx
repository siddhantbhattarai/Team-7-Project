// sections
import { UserListView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'ISMT Hub: Employee List',
};

export default function EmployeeListPage() {
  return <UserListView userList="ADMIN" heading="Admin List" />;
}
