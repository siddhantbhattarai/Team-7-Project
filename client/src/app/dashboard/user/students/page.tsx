import { UserListView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'ISMT Hub: Clients List',
};

export default function StudentListPage() {
  return <UserListView userList="USER" heading="Students" />;
}
