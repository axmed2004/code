#region HIDE APP FROM TASK MANAGER AND PREVENT HIDE ON SHOW DESKTOP
[DllImport("user32.dll", SetLastError = true)]
static extern int SetWindowLong(IntPtr hWnd, int nIndex, IntPtr dwNewLong);

[DllImport("user32.dll", SetLastError = true)]
static extern IntPtr FindWindow(string lpWindowClass, string lpWindowName);

[DllImport("user32.dll", SetLastError = true)]
static extern IntPtr FindWindowEx(IntPtr parentHandle, IntPtr childAfter, string className, string windowTitle);
const int GWL_HWNDPARENT = -8;

IntPtr hprog = FindWindowEx(
  FindWindowEx(
      FindWindow("Progman", "Program Manager"),
      IntPtr.Zero, "SHELLDLL_DefView", ""),
  IntPtr.Zero, "SysListView32", "FolderView"
);

SetWindowLong(new WindowInteropHelper(this).Handle, GWL_HWNDPARENT, hprog);

#endregion
